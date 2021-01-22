A watchface for FitBit Versa smartwatch

![Watchface](https://github.com/hydralien/FitBit-Funktional-Watchface/raw/master/watchface.png "")
![Watchface](https://github.com/hydralien/FitBit-Funktional-Watchface/raw/master/dailystats.png "")
![Watchface](https://github.com/hydralien/FitBit-Funktional-Watchface/raw/master/workoutstats.png "")

`Funktional/` directory is for Versa, Ionic, Versa Light and Versa 2 - all that works with SDK 4.2 (at this point)
`funktional2` is for SDK 5, which at this time supports Versa 3 and Sense.

The two are mostly the same, with some minor differences that could be read about in Fitbit docs. For the project specifics - JS code is mostly shared (app/ files in funktional2 point to app/ files in Funktional), so are styles. Templates are different though, and all element location difference is mainatined in the template using g element translations.

Projects are NPM-based, so first you need to do `npm install` in the one you're working with, then `npx fitbit-build` to make sure it builds, and then `npx fitbit` will provide you with Fitbit SDK CLI, use `help` there for specific some guidance (in short, you'd need `connect device` and `build-and-install` commands there).

