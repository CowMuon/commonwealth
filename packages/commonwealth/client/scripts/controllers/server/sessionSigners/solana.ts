import * as solw3 from '@solana/web3.js';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import {
  actionToHash,
  verify as verifyCanvasSessionSignature,
} from 'helpers/canvas';
import { serializeActionPayload } from '@canvas-js/interfaces';
import type {
  Action,
  ActionArgument,
  ActionPayload,
  Session,
  SessionPayload,
} from '@canvas-js/interfaces';
import { ISessionController } from '.';

const getSolanaSignatureData = (payload: ActionPayload) => {
  return new TextEncoder().encode(serializeActionPayload(payload));
};

export class SolanaSessionController implements ISessionController {
  signers: Record<string, solw3.Keypair> = {};
  private auths: Record<
    number,
    { payload: SessionPayload; signature: string }
  > = {};

  getAddress(chainId: string): string | null {
    return this.signers[chainId].publicKey.toBase58();
  }

  async hasAuthenticatedSession(chainId: string): Promise<boolean> {
    this.getOrCreateSigner(chainId);
    return (
      this.signers[chainId] !== undefined && this.auths[chainId] !== undefined
    );
  }

  async getOrCreateAddress(chainId: string): Promise<string> {
    return (await this.getOrCreateSigner(chainId)).publicKey.toBase58();
  }

  async authSession(
    chainId: string,
    payload: SessionPayload,
    signature: string
  ) {
    const valid = await verifyCanvasSessionSignature({
      session: { type: 'session', payload, signature },
    });
    if (!valid) {
      // throw new Error("Invalid signature");
    }
    if (payload.address !== this.getAddress(chainId)) {
      throw new Error(
        `Invalid auth: ${payload.address} vs. ${this.getAddress(chainId)}`
      );
    }
    this.auths[chainId] = { payload, signature };

    const authStorageKey = `CW_SESSIONS-solana-${chainId}-auth`;
    localStorage.setItem(authStorageKey, JSON.stringify(this.auths[chainId]));
  }

  private async getOrCreateSigner(chainId: string): Promise<solw3.Keypair> {
    if (this.signers[chainId] !== undefined) {
      return this.signers[chainId];
    }
    const storageKey = `CW_SESSIONS-solana-${chainId}`;
    try {
      const storage = localStorage.getItem(storageKey);
      const { privateKey }: { privateKey: string } = JSON.parse(storage);
      this.signers[chainId] = solw3.Keypair.fromSecretKey(
        bs58.decode(privateKey)
      );

      const authStorageKey = `CW_SESSIONS-solana-${chainId}-auth`;
      const auth = localStorage.getItem(authStorageKey);
      if (auth !== null) {
        const {
          payload,
          signature,
        }: { payload: SessionPayload; signature: string } = JSON.parse(auth);
        const valid = await verifyCanvasSessionSignature({
          session: { type: 'session', payload, signature },
        });
        if (!valid) throw new Error();

        if (payload.address === this.getAddress(chainId)) {
          console.log(
            'Restored authenticated session:',
            this.getAddress(chainId)
          );
          this.auths[chainId] = { payload, signature };
        } else {
          console.log('Restored logged-out session:', this.getAddress(chainId));
        }
      }
    } catch (err) {
      console.log('Could not restore previous session', err);
      this.signers[chainId] = solw3.Keypair.generate();
      delete this.auths[chainId];
      const privateKey = bs58.encode(this.signers[chainId].secretKey);
      localStorage.setItem(storageKey, JSON.stringify({ privateKey }));
    }
    return this.signers[chainId];
  }

  async sign(
    chainId: string,
    call: string,
    args: Record<string, ActionArgument>
  ): Promise<{
    session: Session;
    action: Action;
    hash: string;
  }> {
    const signer = this.signers[chainId];
    const sessionPayload = this.auths[chainId]?.payload;
    const sessionSignature = this.auths[chainId]?.signature;
    // TODO: verify payload is not expired

    const actionPayload: ActionPayload = {
      from: sessionPayload.from,
      spec: sessionPayload.spec,
      timestamp: +Date.now(),
      chain: 'solana',
      chainId,
      blockhash: sessionPayload.blockhash, // will be null
      call,
      args,
    };

    const message = getSolanaSignatureData(actionPayload);
    const signatureBytes = nacl.sign.detached(message, signer.secretKey);
    const signature = bs58.encode(signatureBytes);
    if (
      !nacl.sign.detached.verify(
        message,
        signatureBytes,
        signer.publicKey.toBytes()
      )
    ) {
      throw new Error('Invalid signature!');
    }

    const session: Session = {
      type: 'session',
      payload: sessionPayload,
      signature: sessionSignature,
    };
    const action: Action = {
      type: 'action',
      payload: actionPayload,
      session: sessionPayload.from,
      signature,
    };
    const hash = Buffer.from(actionToHash(action)).toString('hex');

    return { session, action, hash };
  }
}
