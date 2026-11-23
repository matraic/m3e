Feature: Action lists
  Action lists expose interactive list items as buttons or links.

  Rule: Actions retain their semantics and disabled state

    Scenario: An action list contains buttons, links, and disabled actions

      Given an action list with buttons, links, and a disabled action
      When the action list renders
      Then the action list exposes the button and link semantics
      And the disabled action cannot be activated
