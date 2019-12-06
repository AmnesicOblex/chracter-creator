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
    }
}