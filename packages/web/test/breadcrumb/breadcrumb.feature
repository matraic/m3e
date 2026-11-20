Feature: Breadcrumb
  Breadcrumbs show the user's location in a hierarchy and provide navigation to ancestor pages.

  Rule: Breadcrumbs identify the current location

    Scenario: Ancestors are links and the final item is the current page
      Given a breadcrumb trail with linked ancestors and a linked final item
      Then the breadcrumb is exposed as a navigation landmark
      And the breadcrumb items are exposed as a list
      And the "Dashboard" link retains href "/dashboard", target "_blank", and rel "noopener"
      And the "Reports" item is a link
      And the "Settings" item is exposed as a button
      And the "Annual" item is current and not interactive

    Scenario: The current item's icon is filled while ancestor icons are outlined
      Given a breadcrumb with icons on linked ancestors and a linked final item
      Then the icon in the "Dashboard" item is not filled
      And the icon in the "Annual" item is filled

    Scenario: An icon-only item uses its item label as its accessible name
      Given a breadcrumb with an icon-only item labelled "Home"
      Then the "Home" breadcrumb item is exposed as a button

    Scenario Outline: Supports current values
      Given a breadcrumb item marked current as "<value>"
      Then the breadcrumb item reflects current value "<value>"

      Examples:
        | value    |
        | page     |
        | step     |
        | location |
        | date     |
        | time     |
        | true     |

    Scenario: Disabled items remain non-actionable
      Given a breadcrumb with a disabled link
      Then the "Dashboard" link is disabled and not in the tab order

  Rule: Breadcrumbs adapt to available space

    Scenario: Breadcrumb items stay on one line by default
      Given a breadcrumb with many items and no wrap
      Then the breadcrumb items occupy one line

    Scenario: The wrap attribute allows items to flow onto multiple lines
      Given a breadcrumb with many items and wrap enabled
      Then the breadcrumb items occupy multiple lines

    Scenario: Enabling wrap after rendering changes the layout
      Given a breadcrumb with many items and no wrap
      When the application enables wrapping
      Then the breadcrumb items occupy multiple lines

  Rule: Breadcrumbs support custom separators

    Scenario: A custom separator replaces defaults and is hidden from assistive technology
      Given a breadcrumb with a custom slash separator
      Then each separator is a slash hidden from assistive technology

  Rule: Breadcrumbs update when their items change

    Scenario: The final item remains current when breadcrumb items are added and removed
      Given a breadcrumb with two items
      Then only the final breadcrumb item is current
      When the application appends the item "Profile"
      Then only the final breadcrumb item is current
      When the application removes the final breadcrumb item
      Then only the final breadcrumb item is current

    Scenario: Moving an item to the end updates current semantics and icon fill
      Given a breadcrumb with icons on linked ancestors and a linked final item
      When the application moves the "Dashboard" item to the end
      Then the "Dashboard" item is current and not interactive
      And the "Annual" item is a link
      And the icon in the "Dashboard" item is filled
      And the icon in the "Annual" item is not filled

  Rule: Breadcrumbs remain accessible when moved in the DOM

    Scenario: Moving a breadcrumb preserves its navigation semantics
      Given a breadcrumb trail with linked ancestors and a linked final item
      When the application moves the breadcrumb to a new DOM parent
      Then the breadcrumb is exposed as a navigation landmark
      And the breadcrumb items are exposed as a list
      And the "Dashboard" link retains href "/dashboard", target "_blank", and rel "noopener"
      And the "Annual" item is current and not interactive
