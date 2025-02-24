/* @jsx m */

import m from 'mithril';
import ClassComponent from 'class_component';

import 'components/component_kit/cw_dropdown.scss';

import { CWTextInput } from './cw_text_input';
import { CWText } from './cw_text';

export type DropdownItemType = {
  label: string;
  value: string;
};

type DropdownAttrs = {
  initialValue?: DropdownItemType;
  label: string;
  onSelect?: (item: DropdownItemType) => void;
  options: Array<DropdownItemType>;
};

export class CWDropdown extends ClassComponent<DropdownAttrs> {
  private showDropdown: boolean;
  private selectedValue: DropdownItemType;

  oninit(vnode: m.Vnode<DropdownAttrs>) {
    this.showDropdown = false;
    this.selectedValue = vnode.attrs.initialValue ?? vnode.attrs.options[0];
  }

  view(vnode: m.Vnode<DropdownAttrs>) {
    const { label, options, onSelect } = vnode.attrs;

    return (
      <div class="dropdown-wrapper">
        <CWTextInput
          iconRight="chevronDown"
          placeholder={this.selectedValue.label}
          displayOnly
          iconRightonclick={() => {
            // Only here because it makes TextInput display correctly
          }}
          label={label}
          onclick={() => {
            this.showDropdown = !this.showDropdown;
          }}
        />
        {this.showDropdown && (
          <div class="dropdown-options-display">
            {options.map((item) => {
              return (
                <div
                  class="dropdown-item"
                  onclick={() => {
                    this.showDropdown = false;
                    this.selectedValue = item;
                    if (onSelect) {
                      onSelect(item);
                    }
                  }}
                >
                  <CWText className="dropdown-item-text">{item.label}</CWText>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}
