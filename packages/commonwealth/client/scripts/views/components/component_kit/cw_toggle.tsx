/* @jsx m */

import m from 'mithril';
import ClassComponent from 'class_component';

import 'components/component_kit/cw_toggle.scss';

import { ComponentType, StyleAttrs } from './types';
import { getClasses } from './helpers';

type ToggleStyleAttrs = {
  checked?: boolean;
} & StyleAttrs;

type ToggleAttrs = {
  onchange: (e?: any) => void;
} & ToggleStyleAttrs;

export class CWToggle extends ClassComponent<ToggleAttrs> {
  view(vnode: m.Vnode<ToggleAttrs>) {
    const { className, disabled = false, onchange, checked } = vnode.attrs;

    const params = {
      disabled,
      onchange,
      checked,
      type: 'checkbox',
    };

    return (
      <label
        class={getClasses<ToggleStyleAttrs>(
          {
            checked,
            disabled,
            className,
          },
          ComponentType.Toggle
        )}
      >
        <input class="toggle-input" {...params} />
        <div class="slider" />
      </label>
    );
  }
}
