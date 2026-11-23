Feature: Lists
  Lists organize content and provide consistent shape families across list items.

  Rule: List item and media shape families resolve independently

    Scenario Outline: List surfaces resolve item and media shape families in <direction>

      Given list surfaces with different item and media families in "<direction>"
      When the list fixture renders
      Then the default item and media surfaces use the expected shape families
      When custom shape families are applied to the list surfaces
      Then each item and media surface uses its configured shape family

      Examples:
        | direction |
        | ltr       |
        | rtl       |

  Rule: Lists expose list semantics and rich item content

    Scenario: A segmented list exposes its items and slotted content

      Given a segmented list with labelled rich items
      When the list fixture renders
      Then the list exposes both items and their slotted content
