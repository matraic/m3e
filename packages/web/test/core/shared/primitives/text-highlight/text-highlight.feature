Feature: Text highlighting
  Scenario: Highlighting is supported and no term produces no ranges
    Given a text highlighter containing "Apple"
    When the text highlighter renders
    Then text highlighting is supported
    And the text highlighter ranges are ""

  Scenario: Contains mode ignores case by default
    Given a text highlighter containing "Apple apricot grape" with 'term="AP"'
    When the text highlighter renders
    Then the text highlighter ranges are "Ap, ap, ap"

  Scenario: Matching can be case-sensitive
    Given a text highlighter containing "Apple apricot" with 'term="Ap" case-sensitive'
    When the text highlighter renders
    Then the text highlighter ranges are "Ap"

  Scenario: Starts-with only matches the beginning
    Given text highlighters testing starts-with matches
    When the text highlighter renders
    Then the first text highlighter ranges are "App"
    And the second text highlighter ranges are ""

  Scenario: Ends-with only matches the end
    Given text highlighters testing ends-with matches
    When the text highlighter renders
    Then the first text highlighter ranges are "ple"
    And the second text highlighter ranges are ""

  Scenario: Nested text is included
    Given a text highlighter containing nested text
    When the text highlighter renders
    Then the text highlighter ranges are "an"

  Scenario: Disabling removes highlights
    Given a text highlighter containing "Apple" with 'term="ap"'
    When the text highlighter renders
    Then the text highlighter ranges are "Ap"
    When the application disables the text highlighter
    Then the text highlighter ranges are ""
    And the text highlighter reflects disabled

  Scenario: Changing the term updates matches
    Given a text highlighter containing "Apple grape" with 'term="ap"'
    When the text highlighter renders
    Then the text highlighter ranges are "Ap, ap"
    When the application sets the highlight term to "gr"
    Then the text highlighter ranges are "gr"

  Scenario: Clearing the term removes the CSS highlight
    Given a text highlighter containing "Apple" with 'term="ap"'
    When the text highlighter renders
    Then the browser has 1 CSS highlight
    When the application sets the highlight term to ""
    Then the browser has 0 CSS highlights

  Scenario: Highlight events contain the matching ranges
    Given a text highlighter containing "Apple apricot"
    When the text highlighter renders
    And the application observes the next highlight event and sets the term to "ap"
    Then the highlight event ranges are "Ap, ap"

  Scenario: Highlight events do not bubble
    Given a text highlighter inside a parent
    When the text highlighter renders
    And the application observes highlight events on the parent
    And the application sets the highlight term to "ap"
    Then the parent has received no highlight events
