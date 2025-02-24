/* @jsx m */

import m from 'mithril';
import ClassComponent from 'class_component';

import app from 'state';
import { HelpMenu } from './menus/help_menu';
import { CreateContentMenu } from './menus/create_content_menu';
import { MainMenu } from './menus/main_menu';
import { NotificationsMenu } from './menus/notifications_menu';

const mobileMenuLookup = {
  CreateContentMenu,
  HelpMenu,
  MainMenu,
  NotificationsMenu,
};

export type MobileMenuName = keyof typeof mobileMenuLookup;

export class AppMobileMenus extends ClassComponent {
  view() {
    const ActiveMenu = mobileMenuLookup[app.mobileMenu];

    return <ActiveMenu />;
  }
}
