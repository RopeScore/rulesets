# RopeScore Rulesets

[![codecov](https://codecov.io/gh/RopeScore/rulesets/graph/badge.svg?token=4OQJQODHGR)](https://codecov.io/gh/RopeScore/rulesets)

RopeScore rulesets provides a library of calculations for Rope Skipping
competition rules.

These rules are exposed on four different levels from this package:

- **Models**\
  A raw scoring model for a category or type of events, as defined by a specific
  rulebook. It is highly configurable and comes in two flavours:
  - **Competition Event Model**\
    These provide a set of judges with description of their input fields and
    calculations for their judge score. These models also provide functions to
    calculate an entry score, entry ranks, and descriptions of result- and
    preview (shown to the tabulator) tables.
  - **Overall Model**\
    These provide calculations to create ranks across several models, as well
    as descriptions of result tables.
- **Competition Events/Overalls**\
  This is a pre-configured model for a known competition event definition.
  There may be some configuration options still left available that are meant to
  be set on a per-competition level.
- **Rulesets**\
  This provides a filtered list of competition events and overalls relevant to a
  specific rulebook and version.

The scoring pipeline then goes as follows:

1. (Configure your model or use a pre-configured model)
2. Calculate every judge's score
3. Take the result of that calculation and calculate every entry's score
4. Take the result of that calculation and calculate the competition event's
   rankings.
5. You can also take the results of multiple competition event's score
   calculations (3) and use those results to calculate an overall's rankings.
