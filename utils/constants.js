module.exports = {
    localTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    projektMelodyEpoch: new Date('2020-02-07T23:21:48.000Z'),
    later: function later(delay, value) {
        // greets stackoverflow, i think
        return new Promise(resolve => setTimeout(resolve, delay, value));
    },
    cidV0Regex: /Qm[a-zA-Z0-9]{44}/
}