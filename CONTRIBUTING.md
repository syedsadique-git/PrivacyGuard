# Contributing to PrivacyGuard

Thank you for your interest in contributing to PrivacyGuard! This document provides guidelines for contributing to the project.

## Code of Conduct

Be respectful, inclusive, and professional. We're all here to build better privacy tools.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/yourusername/privacyguard/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Your environment (OS, browser, Node version)

### Suggesting Features

1. Check [Issues](https://github.com/yourusername/privacyguard/issues) for existing feature requests
2. Create a new issue with:
   - Clear use case
   - Why this feature is valuable
   - Proposed implementation (optional)

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with clear messages**: `git commit -m "Add feature: description"`
6. **Push to your fork**: `git push origin feature/your-feature-name`
7. **Open a Pull Request**

## Development Guidelines

### Code Style

**JavaScript/React:**
- Use functional components with hooks
- Use ES6+ features
- Follow existing code formatting
- Use meaningful variable names
- Add comments for complex logic

**CSS/Tailwind:**
- Use Tailwind utility classes
- Follow the design system (cyber-dark theme)
- Keep custom CSS minimal

### Commit Messages

Use clear, descriptive commit messages:

\`\`\`
Good:
- "Add tracker filtering by category"
- "Fix privacy score calculation bug"
- "Update dashboard layout for mobile"

Bad:
- "fix bug"
- "update"
- "changes"
\`\`\`

### Testing

Before submitting a PR:

1. Test your changes locally
2. Verify no console errors
3. Test on both Chrome and Firefox (for extension changes)
4. Test responsive design (mobile + desktop)
5. Verify no breaking changes to existing features

### Documentation

- Update README.md if adding features
- Add JSDoc comments for complex functions
- Update API documentation for new endpoints

## Project Structure

\`\`\`
client/          # React frontend
  src/
    features/    # Feature modules (auth, dashboard, etc.)
    components/  # Shared components
    lib/         # Utilities and API client

server/          # Node.js backend
  controllers/   # Business logic
  routes/        # API routes
  middleware/    # Auth, validation
  prisma/        # Database schema

extension/       # Browser extension
\`\`\`

## Areas for Contribution

### High Priority

- [ ] Full EasyList/EasyPrivacy integration
- [ ] Real HaveIBeenPwned API integration
- [ ] PDF report generation
- [ ] Email notification system
- [ ] Mobile responsive improvements

### Medium Priority

- [ ] Advanced tracker categorization
- [ ] Whitelist/blacklist management
- [ ] Export data (JSON, CSV)
- [ ] Dark/light theme toggle
- [ ] Internationalization (i18n)

### Good First Issues

- [ ] Add loading skeletons
- [ ] Improve error messages
- [ ] Add tooltips for features
- [ ] Improve accessibility (ARIA labels)
- [ ] Add unit tests

## Questions?

- Open a [Discussion](https://github.com/yourusername/privacyguard/discussions)
- Join our [Discord](https://discord.gg/privacyguard) (if available)
- Email: contribute@privacyguard.com

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for helping make the web more private! 🛡️**
