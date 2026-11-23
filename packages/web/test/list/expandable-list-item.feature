Feature: Expandable list items
  Expandable list items reveal nested items and communicate their expanded state.

  Rule: Segmented expandable groups adapt their corners to their contents

    Scenario Outline: An expanded segmented group applies outer corners in <direction>

      Given a segmented action list with an expandable group in "<direction>"
      When the expandable list fixture renders
      Then the collapsed group has no outer corners
      When the group expands
      Then the header and nested items use the expanded outer corners
      When the application changes segmented outer corner families
      Then the expanded group follows the custom corner families
      When the group collapses
      Then the header returns to the collapsed shape

      Examples:
        | direction |
        | ltr       |
        | rtl       |

  Rule: Expandable items expose and toggle their nested list

    Scenario: An expandable item exposes its nested list and updates expanded state

      Given an expandable item with nested fruit
      When the expandable list fixture renders
      Then the fruit group is collapsed and its nested list is hidden
      And the fruit group controls its labelled nested list
      When the user expands the fruit group
      Then the fruit group is expanded and its nested list is visible
      When the user collapses the fruit group
      Then the fruit group is collapsed and its nested list is hidden
