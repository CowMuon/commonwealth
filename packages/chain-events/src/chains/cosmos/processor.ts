/**
 * Processes Cosmos events.
 */
import { IEventProcessor, CWEvent, SupportedNetwork } from '../../interfaces';
import { addPrefix, factory } from '../../logging';

import { ParseType } from './filters/type_parser';
import { Enrich } from './filters/enricher';
import { IEventData, RawEvent, Api } from './types';

export class Processor extends IEventProcessor<Api, RawEvent> {
  constructor(protected _api: Api, protected readonly chain?: string) {
    super(_api);
  }

  /**
   * Parse events out of an ethereum block and standardizes their format
   * for processing.
   *
   * @param event
   * @returns an array of processed events
   */
  public async process(event: RawEvent): Promise<CWEvent<IEventData>[]> {
    const log = factory.getLogger(
      addPrefix(__filename, [SupportedNetwork.Cosmos, this.chain])
    );

    const kind = ParseType(event.message.typeUrl, this.chain);
    if (!kind) return [];
    try {
      const cwEvent = await Enrich(this._api, event.height, kind, event);
      return [cwEvent];
    } catch (e) {
      log.error(
        `Failed to enrich event. Block number: ${event.height}, Name/Kind: ${event.message.typeUrl}, Error Message: ${e.message}`
      );
      return [];
    }
  }
}
