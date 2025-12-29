# Contributing to Splitter

First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to Splitter, which is hosted on GitHub. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Code of Conduct

This project and everyone participating in it is governed by the [Splitter Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [conduct@splitter.app](mailto:conduct@splitter.app).

## What should I know before I get started?

### Project Structure

Splitter is a full-stack application with the following structure:

```
splitter/
├── splitter-app/          # React Native frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── screens/       # Screen components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API service layer
│   │   ├── utils/         # Utility functions
│   │   └── store/         # State management (Zustand)
│   └── ...
└── splitter-backend/      # Express.js backend
    ├── src/
    │   ├── controllers/   # Request handlers
    │   ├── models/        # Database models (Mongoose)
    │   ├── routes/        # API routes
    │   ├── middleware/    # Custom middleware
    │   ├── services/      # Business logic
    │   └── utils/         # Utility functions
    └── ...
```

### Technology Stack

**Frontend:**
- React Native with Expo
- TypeScript
- Zustand for state management
- React Navigation for routing
- Axios for HTTP requests

**Backend:**
- Node.js with Express.js
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- Jest for testing

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for Splitter. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

Before creating bug reports, please check [this list](#before-submitting-a-bug-report) as you might find out that you don't need to create one. When you are creating a bug report, please [include as many details as possible](#how-do-i-submit-a-good-bug-report). Fill out [the required template](.github/ISSUE_TEMPLATE/bug_report.md), the information it asks for helps us resolve issues faster.

> **Note:** If you find a **Closed** issue that seems like it is the same thing that you're experiencing, open a new issue and include a link to the original issue in the body of your new one.

#### Before Submitting A Bug Report

* **Check the [documentation](README.md)** for tips on troubleshooting.
* **Perform a [cursory search](https://github.com/splitter-app/splitter/issues)** to see if the problem has already been reported. If it has **and the issue is still open**, add a comment to the existing issue instead of opening a new one.

#### How Do I Submit A (Good) Bug Report?

Bugs are tracked as [GitHub issues](https://guides.github.com/features/issues/). After you've determined [which repository](#splitter-structure) your bug is related to, create an issue on that repository and provide the following information by filling in [the template](.github/ISSUE_TEMPLATE/bug_report.md).

Explain the problem and include additional details to help maintainers reproduce the problem:

* **Use a clear and descriptive title** for the issue to identify the problem.
* **Describe the exact steps which reproduce the problem** in as many details as possible.
* **Provide specific examples to demonstrate the steps**. Include links to files or GitHub projects, or copy/pasteable snippets, which you use in those examples.
* **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
* **Explain which behavior you expected to see instead and why.**
* **Include screenshots and animated GIFs** which show you following the described steps and clearly demonstrate the problem.
* **If you're reporting that Splitter crashed**, include a crash report with a stack trace from the operating system.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for Splitter, including completely new features and minor improvements to existing functionality. Following these guidelines helps maintainers and the community understand your suggestion and find related suggestions.

Before creating enhancement suggestions, please check [this list](#before-submitting-an-enhancement-suggestion) as you might find out that you don't need to create one. When you are creating an enhancement suggestion, please [include as many details as possible](#how-do-i-submit-a-good-enhancement-suggestion). Fill in [the template](.github/ISSUE_TEMPLATE/feature_request.md), including the steps that you imagine you would take if the feature you're requesting existed.

#### Before Submitting An Enhancement Suggestion

* **Check the [documentation](README.md)** to see if the feature is already implemented.
* **Perform a [cursory search](https://github.com/splitter-app/splitter/issues)** to see if the enhancement has already been suggested. If it has, add a comment to the existing issue instead of opening a new one.

#### How Do I Submit A (Good) Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues](https://guides.github.com/features/issues/). After you've determined [which repository](#splitter-structure) your enhancement suggestion is related to, create an issue on that repository and provide the following information:

* **Use a clear and descriptive title** for the issue to identify the suggestion.
* **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
* **Provide specific examples to demonstrate the steps**.
* **Describe the current behavior** and **explain which behavior you expected to see instead** and why.
* **Include screenshots and animated GIFs** which help you demonstrate the steps or point out the part of Splitter which the suggestion is related to.
* **Explain why this enhancement would be useful** to most Splitter users.
* **Specify which version of Splitter you're using.**
* **Specify the name and version of the OS you're using.**

### Your First Code Contribution

Unsure where to begin contributing to Splitter? You can start by looking through these `beginner` and `help-wanted` issues:

* [Beginner issues][beginner] - issues which should only require a few lines of code, and a test or two.
* [Help wanted issues][help-wanted] - issues which should be a bit more involved than `beginner` issues.

Both issue lists are sorted by total number of comments. While not perfect, number of comments is a reasonable proxy for impact a given change will have.

### Pull Requests

The process described here has several goals:

- Maintain Splitter's quality
- Fix problems that are important to users
- Engage the community in working toward the best possible Splitter
- Enable a sustainable system for Splitter's maintainers to review contributions

Please follow these steps to have your contribution considered by the maintainers:

1. Follow all instructions in [the template](.github/pull_request_template.md)
2. Follow the [styleguides](#styleguides)
3. After you submit your pull request, verify that all [status checks](https://help.github.com/articles/about-status-checks/) are passing <details><summary>What if the status checks are failing?</summary>If a status check is failing, and you believe that the failure is unrelated to your change, please leave a comment on the pull request explaining why you believe the failure is unrelated. A maintainer will re-run the status check for you. If we conclude that the failure was a false positive, then we will open an issue to track that problem with our status check suite.</details>

While the prerequisites above must be satisfied prior to having your pull request reviewed, the reviewer(s) may ask you to complete additional design work, tests, or other changes before your pull request can be ultimately accepted.

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line
* When only changing documentation, include `[ci skip]` in the commit title
* Consider starting the commit message with an applicable emoji:
    * :art: `:art:` when improving the format/structure of the code
    * :racehorse: `:racehorse:` when improving performance
    * :non-potable_water: `:non-potable_water:` when plugging memory leaks
    * :memo: `:memo:` when writing docs
    * :penguin: `:penguin:` when fixing something on Linux
    * :apple: `:apple:` when fixing something on macOS
    * :checkered_flag: `:checkered_flag:` when fixing something on Windows
    * :bug: `:bug:` when fixing a bug
    * :fire: `:fire:` when removing code or files
    * :green_heart: `:green_heart:` when fixing the CI build
    * :white_check_mark: `:white_check_mark:` when adding tests
    * :lock: `:lock:` when dealing with security
    * :arrow_up: `:arrow_up:` when upgrading dependencies
    * :arrow_down: `:arrow_down:` when downgrading dependencies
    * :shirt: `:shirt:` when removing linter warnings

### TypeScript Styleguide

All TypeScript code must adhere to the [Splitter Style Guide](STYLEGUIDE.md).

### Documentation Styleguide

* Use [Markdown](https://daringfireball.net/projects/markdown).
* Reference methods and classes in markdown with the custom `{}` notation:
    * Reference classes with `{ClassName}`
    * Reference instance methods with `{ClassName.methodName}`
    * Reference class methods with `{ClassName#methodName}`

## Additional Notes

### Issue and Pull Request Labels

This section lists the labels we use to help us track and manage issues and pull requests.

[GitHub search](https://help.github.com/articles/searching-issues/) makes it easy to use labels for finding groups of issues or pull requests you're interested in.

The labels are loosely grouped by their purpose, but it's not required that every issue have a label from every group or that an issue can't have more than one label from the same group.

Please open an issue on `splitter-app/splitter` if you have suggestions for new labels.

#### Type of Issue and Issue State

* `bug` - Issues that are bugs.
* `enhancement` - Issues that are feature requests.
* `documentation` - Issues for improving documentation.
* `question` - Issues that are questions.
* `help-wanted` - Issues that need assistance.
* `beginner` - Issues that are good for beginners.
* `duplicate` - Issues that are duplicates of other issues.
* `wontfix` - Issues that will not be addressed.
* `invalid` - Issues that are invalid.
* `more-information-needed` - Issues that need more information.

#### Topic Categories

* `frontend` - Issues related to the frontend.
* `backend` - Issues related to the backend.
* `database` - Issues related to the database.
* `ui` - Issues related to the user interface.
* `api` - Issues related to the API.
* `security` - Issues related to security.
* `performance` - Issues related to performance.
* `accessibility` - Issues related to accessibility.
* `internationalization` - Issues related to internationalization.

#### Pull Request Labels

* `work-in-progress` - Pull requests which are still being worked on, more changes will follow.
* `needs-review` - Pull requests which need code review, and approval from maintainers.
* `under-review` - Pull requests being reviewed by maintainers.
* `requires-changes` - Pull requests which need to be updated based on review comments.
* `needs-testing` - Pull requests which need manual testing.

## Community

You can chat with the core team and other community members in the following places:

* [GitHub Discussions](https://github.com/splitter-app/splitter/discussions)
* [Discord](https://discord.gg/splitter)
* [Twitter](https://twitter.com/splitterapp)

## Recognition

Contributors who have made significant contributions to the project will be recognized in the following ways:

* Added to the contributors list in the README
* Featured in release notes for major contributions
* Invited to be maintainers for the project
* Given credit in presentations and documentation

## Questions?

If you have any questions about contributing, please contact us at [contributors@splitter.app](mailto:contributors@splitter.app).
