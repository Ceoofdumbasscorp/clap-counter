let clapCount = 0
let clapWindow = 0
let lastClapTime = 0
let noiseFloor = 0
let calibrated = false
const CLAP_TIMEOUT = 600
const MAX_COUNT = 99

function calibrateNoise() {
    let sum = 0
    for (let i = 0; i < 30; i++) {
        sum += input.soundLevel()
        basic.pause(20)
    }
    noiseFloor = sum / 30
    calibrated = true
    basic.showIcon(IconNames.Yes)
    basic.pause(500)
    basic.clearScreen()
}

input.onButtonPressed(Button.A, function () {
    clapCount = 0
    basic.showNumber(clapCount)
})

input.onButtonPressed(Button.B, function () {
    calibrateNoise()
})

basic.forever(function () {
    if (!calibrated) return

    let level = input.soundLevel()
    let threshold = noiseFloor + 25
    let now = input.runningTime()

    if (level > threshold && now - lastClapTime > 200) {
        lastClapTime = now
        clapWindow += 1
        music.playTone(988, music.beat(BeatFraction.Sixteenth))
    }

    if (clapWindow > 0 && now - lastClapTime > CLAP_TIMEOUT) {
        if (clapWindow == 1) {
            clapCount += 1
        } else if (clapWindow == 2) {
            clapCount -= 1
        } else if (clapWindow >= 3) {
            clapCount = 0
            music.playTone(262, music.beat(BeatFraction.Whole))
        }

        if (clapCount < 0) clapCount = 0
        if (clapCount > MAX_COUNT) clapCount = MAX_COUNT

        basic.showNumber(clapCount)
        clapWindow = 0
    }
})
