const dice = require('@amnesic0blex/dice')
const tables = require('@amnesic0blex/tables')

// TODO: Character class.
// TODO: Character roll function.
// TODO: Fast PC roll function.
// TODO: NPC class.
// TODO: Fast NPC roll function.
// TODO: Deal with half elves.
// TODO: Roll height and weight.
// TODO: Roll name.
// TODO: Roll age.
// TODO: Script for commander npc and pc rolling?

/**
 * Rolls 6 raw ability scores by rolling 4d6 and dropping the lowest.
 * @returns Returns an array of 6 unmodified scores.
 */
function rollAbilityScores () {
    var scores = []
    // rolls scores by rolling 4 d6 and dropping lowest, 6 times
    for (var i = 0; i < 6; ++i) {
        var rolls = dice.roll(4,6)
        rolls.sort()
        rolls.shift()
        scores.push(rolls.reduce(dice.getSum))
    }
    // sorts scores in descending order
    scores.sort(function(a, b) {
        return b - a;
    })

    return scores
}

/**
 * Randomly rolls the priority of each ability.
 * @returns Array of abilities in descending order of priority.
 */
function rollDistribution () {
    var abilities = [
        "Str",
        "Dex",
        "Con",
        "Wis",
        "Int",
        "Chr"
    ]
    var distribution = []   // empty ability distribution.
    // Randomly removes an ability from abilities and pushes it to distribution
    // until there are no more abilities in abilities.
    while (abilities.length !== 0) {
        var index = dice.roll(1,abilities.length) - 1
        distribution.push(abilities[index])
        abilities.splice(index, 1)
    }

    return distribution
}

/**
 * Sorts the given ability scores into the desired distribution.
 * @param {Array} scores - The array of 6 raw ability scores.
 * @param {Array} distribution - The desired ability score distribution.
 * @returns The sorted ability score object.
 */
function sortAbilityScores (scores, distribution) {
    var abilityScores = {
        Str: 0,
        Dex: 0,
        Con: 0,
        Int: 0,
        Wis: 0,
        Chr: 0
    }
    for (var i = 0; i < distribution.length; ++i) {
        abilityScores[distribution[i]] = scores[i]
    }
    return abilityScores
}

/**
 * Adds a creatures racial bonuses to its ability scores.
 * @param {Object} abilityScores - The ability scores to be modified.
 * @param {String, Object} race - The desired race.
 */
function addRacialBonuses (abilityScores, race, customIncrease) {
    scores = JSON.parse(JSON.stringify(abilityScores))
    var scoreIncrease
    if (race === "halfElf") {
        scoreIncrease = customIncrease
    } else {
        scoreIncrease = tables.races[race].scoreIncrease
    }
    for (var property in scores) {
        scores[property] += scoreIncrease[property]
    }
    return scores
}

/**
 * Rolls height and weight for the given race and gender.
 * @param {String} race The race height and weight tables to use.
 * @param {String} gender Male or female.
 * @returns Object with height and weight
 */
function rollHeightWeight (race, gender) {
    var body = tables.races[race].body
    var height = improperFeetToInches(body.baseHeight)
    var weight = body.baseWeight
    var heightMod = dice.roll(body.heightMod[0],body.heightMod[1]).reduce(dice.getSum)
    height = height + heightMod
    var weightMod = dice.roll(body.weightMod[0],body.weightMod[1]).reduce(dice.getSum)
    weightMod = weightMod * heightMod
    if (gender === 'female') {
        weight = Math.floor(weight * 0.8)
    }
    weight = weight + weightMod
    var body = {
        height: inchesToImproperFeet(height),
        weight: weight
    }
    return body
}

/**
 * Converts inches to feet and inches.
 * @param {Number} inches Raw inches.
 * @returns String with feet and inch conversion
 */
function inchesToImproperFeet (inches) {
    return `${Math.floor(inches / 12)}'${inches % 12}"`
}

/**
 * Converts a string of feet and inches to a number inches.
 * @param {String} quantity String with feet and inches
 * @returns Number with total numbers of inches.
 */
function improperFeetToInches (quantity) {
    var regex = /(\d)'(\d*)"/
    var capture = quantity.match(regex)
    var feet = parseInt(capture[1],10) * 12
    var inches = parseInt(capture[2],10)
    return feet + inches
}

module.exports = {
    /**
     * Rolls 6 raw ability scores.
     * @returns Returns an array of 6 unmodified scores.
     */
    rollAbilityScores () {
        return rollAbilityScores()
    },

    /**
     * Randomly rolls the priority of each ability.
     * @returns Array of abilities in descending order of priority.
     */
    rollDistribution () {
        return rollDistribution()
    },

    /**
     * Sorts the given ability scores into the desired distribution.
     * @param {Array} scores - The array of 6 raw ability scores.
     * @param {Array} distribution - The desired ability score distribution.
     * @returns The sorted ability score object.
     */
    sortAbilityScores (scores, distribution) {
        return sortAbilityScores(scores, distribution)
    },

    /**
     * Adds a creatures racial bonuses to its ability scores.
     * @param {Object} abilityScores - The ability scores to be modified.
     * @param {String, Object} race - The desired race.
     */
    addRacialBonuses (abilityScores, race, customIncrease) {
        return addRacialBonuses(abilityScores, race, customIncrease)
    },

    /**
     * Rolls height and weight for the given race and gender.
     * @param {String} race The race height and weight tables to use.
     * @param {String} gender Male or female.
     * @returns Object with height and weight
     */
    rollHeightWeight (race, gender) {
        return rollHeightWeight(race, gender)
    }
}