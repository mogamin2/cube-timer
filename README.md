# Cube Timer

A modern, feature-rich speedcubing timer with statistics tracking, multiple puzzle support, and a beautiful user interface.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Tests](https://img.shields.io/badge/tests-passing-brightgreen)

## Features

### Core Functionality
- **Multi-Puzzle Support**: 2x2, 3x3, 4x4, and 5x5 cube timing
- **WCA-Compliant Inspection**: Optional 15-second inspection with +2 and DNF penalties
- **Advanced Statistics**: Tracks best time, ao5, ao12, session average, and solve count
- **Smart Scramble Generation**: Generates valid scrambles that avoid consecutive moves on the same axis
- **Persistent Storage**: Automatic saving to browser localStorage
- **Keyboard & Touch Support**: Works seamlessly on desktop and mobile devices

### Statistics & Analysis
- **Best Time**: Personal best for current puzzle type
- **Average of 5 (ao5)**: Trimmed mean of last 5 solves
- **Average of 12 (ao12)**: Trimmed mean of last 12 solves
- **Session Average**: Mean of all solves in current session
- **Solve Count**: Total number of solves

### Penalty System
- **+2 Penalty**: Add 2 seconds to any solve
- **DNF (Did Not Finish)**: Mark invalid solves
- **Toggle Penalties**: Easily toggle penalties on/off for each solve
- **Delete Solves**: Remove individual solves from history

### Modern Design
- **Glassmorphism UI**: Beautiful frosted glass effects
- **Smooth Animations**: 60fps transitions and micro-interactions
- **Gradient Accents**: Eye-catching gradient effects throughout
- **Dark/Light Themes**: Fully themed with optimized color palettes
- **Responsive Design**: Looks great on all screen sizes
- **Accessibility**: Proper focus states and keyboard navigation

## Getting Started

### Prerequisites
- A modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- For development: Node.js 18+ and npm

### Installation

1. **Clone or download the repository**
   ```bash
   git clone https://github.com/mogamin2/cube-timer.git
   cd cube-timer
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser
   - Or use a local server:
     ```bash
     python3 -m http.server 8000
     # Then visit http://localhost:8000
     ```

3. **For development with tests**
   ```bash
   npm install
   npm test
   ```

## Usage

### Basic Timer Operation

1. **Start Timer**:
   - Press and hold `Space` bar
   - Timer indicator turns green when ready
   - Release to start

2. **Stop Timer**:
   - Press `Space` again while timer is running

3. **With Inspection**:
   - Enable in settings (enabled by default)
   - 15-second countdown before timer starts
   - Timer automatically applies +2 penalty if started after 15 seconds
   - DNF penalty if started after 17 seconds

4. **Cancel Timer**:
   - Press `Escape` to cancel during timer or inspection

### Managing Solves

- **Apply +2 Penalty**: Click the `+2` button next to a solve
- **Mark as DNF**: Click the `DNF` button next to a solve
- **Delete Solve**: Click the `✕` button next to a solve
- **Clear Session**: Click `クリア` button to delete all solves (requires confirmation)

### Changing Puzzle Type

Use the dropdown in the header to switch between:
- 2x2x2 (9-move scrambles)
- 3x3x3 (20-move scrambles)
- 4x4x4 (40-move scrambles)
- 5x5x5 (60-move scrambles)

### Settings

Click the gear icon to access settings:
- **Inspection**: Enable/disable 15-second inspection
- **Hide UI When Timing**: Minimize distractions during solves
- **Hold Time**: Adjust delay before timer is ready (0ms, 300ms, 500ms, 1000ms)
- **Theme**: Switch between Dark and Light themes

## Project Structure

```
cube-timer/
├── index.html              # Main HTML file
├── style.css               # Modern CSS with glassmorphism effects
├── app.js                  # Main application logic
├── src/
│   └── modules/
│       ├── scrambleGenerator.js  # Scramble generation logic
│       ├── timeFormatter.js      # Time formatting utilities
│       └── statistics.js         # Statistics calculations
├── tests/
│   ├── setup.js            # Test configuration
│   ├── unit/
│   │   ├── scrambleGenerator.test.js
│   │   ├── timeFormatter.test.js
│   │   └── statistics.test.js
│   └── integration/
│       └── storage.test.js
├── package.json            # Node.js dependencies
├── vitest.config.js        # Test configuration
└── README.md               # This file
```

## Development

### Running Tests

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Test Coverage

Current test coverage:
- **Scramble Generator**: 100% coverage of scramble generation logic
- **Time Formatter**: 100% coverage of time formatting edge cases
- **Statistics**: 100% coverage of average calculations and penalties
- **Storage**: Integration tests for localStorage persistence

### Adding New Features

1. **Extract testable logic** into `src/modules/`
2. **Write tests first** in `tests/unit/` or `tests/integration/`
3. **Implement the feature** in the appropriate module
4. **Integrate** into `app.js`
5. **Update documentation** in this README

## Modern Design Features

### Visual Enhancements

- **Glassmorphism**: Frosted glass effect with backdrop blur
- **Gradient Text**: Smooth gradients on logo and statistics
- **Smooth Animations**:
  - Fade-in on page load
  - Staggered animations for stats cards
  - Pulse animations for timer states
  - Smooth transitions on all interactions

### Typography

- **Inter Font**: Modern variable font with optimal readability
- **Tabular Numbers**: Consistent width for timer display
- **Improved Spacing**: Better letter-spacing and line-height

### Color System

- **Extended Palette**: Multiple gradient variations and glow effects
- **Enhanced Shadows**: Layered shadow system for depth
- **Accent Colors**: Green gradient for success states
- **Border System**: Subtle elevated borders with transparency

### Micro-interactions

- **Hover Effects**: Transform and scale animations
- **Focus States**: Clear keyboard navigation indicators
- **Button Feedback**: Immediate visual feedback on all interactions
- **Loading States**: Smooth state transitions

## Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome  | 90+     | ✅ Full |
| Firefox | 88+     | ✅ Full |
| Safari  | 14+     | ✅ Full |
| Edge    | 90+     | ✅ Full |

**Note**: Older browsers may not support all visual effects (backdrop-filter, modern gradients) but core functionality will work.

## Performance

- **Optimized Animations**: Uses `transform` and `opacity` for GPU acceleration
- **Lazy Loading**: Statistics calculated only when needed
- **Efficient Storage**: Minimal localStorage usage
- **60fps Animations**: Smooth transitions throughout

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Start/stop timer |
| `Escape` | Cancel timer or inspection |

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

### Development Guidelines

1. Follow existing code style
2. Write tests for new features
3. Update documentation
4. Ensure all tests pass before submitting
5. Keep commits atomic and well-described

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- Scramble generation algorithms based on WCA standards
- UI inspired by modern speedcubing timers
- Built with vanilla JavaScript for maximum compatibility
- Tested with Vitest for reliability

## Changelog

### Version 1.0.0 (2024-11-30)

#### Added
- Modern glassmorphism UI design
- Comprehensive test suite with Vitest
- Modular code architecture
- Enhanced statistics tracking
- Persistent storage with localStorage
- Multi-puzzle support (2x2, 3x3, 4x4, 5x5)
- WCA-compliant inspection mode
- Dark and light themes
- Responsive mobile design
- Keyboard and touch controls

#### Design Improvements
- Inter font for better readability
- Gradient effects throughout UI
- Smooth animations and transitions
- Enhanced shadow system
- Modern color palette
- Improved spacing and layout

#### Technical
- Extracted testable modules
- 42 passing tests
- localStorage integration tests
- Unit tests for core logic
- Vitest test framework
- ES6 modules support

---

Made with ⚡ by speedcubers, for speedcubers.
