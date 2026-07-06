---
name: Feature request
description: Suggest a new feature or enhancement for this project.
title: "[Feature] "
labels: enhancement
body:
  - type: input
    id: feature-title
    attributes:
      label: Feature title
      description: Short title for the feature.
      placeholder: Add ticket filters
    validations:
      required: true

  - type: textarea
    id: business-problem
    attributes:
      label: Business problem
      description: What problem or business need does this feature address?
      placeholder: Describe the current issue or opportunity.
    validations:
      required: true

  - type: textarea
    id: user-story
    attributes:
      label: User story
      description: Describe the user need in story format.
      placeholder: As a [role], I want [capability] so that [benefit].
    validations:
      required: true

  - type: textarea
    id: acceptance-criteria
    attributes:
      label: Acceptance criteria
      description: List the conditions that must be met for this feature to be complete.
      placeholder: - Criterion 1
      - Criterion 2
    validations:
      required: true

  - type: textarea
    id: api-changes
    attributes:
      label: API changes
      description: Describe any API endpoint, request, or response changes.
      placeholder: Add GET /api/tickets?status=Open
    validations:
      required: false

  - type: textarea
    id: test-cases
    attributes:
      label: Test cases
      description: List the tests that should be covered.
      placeholder: - Returns filtered tickets for a given status
      - Returns empty list when no tickets match
    validations:
      required: false

  - type: dropdown
    id: priority
    attributes:
      label: Priority
      options:
        - Low
        - Medium
        - High
      default: Medium
    validations:
      required: true
