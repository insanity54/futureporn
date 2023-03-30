require('dotenv/config')
const EleventyFetch = require("@11ty/eleventy-fetch");


module.exports = async function() {
  const incompleteGoalsJson = await EleventyFetch(`https://api.github.com/repos/insanity54/futureporn/issues?labels=Goal&state=open`, {
    duration: '1m',
    type: 'json'
  })

  const completedGoalsJson = await EleventyFetch('https://api.github.com/repos/insanity54/futureporn/issues?labels=Goal&state=closed', {
    duration: '1m',
    type: 'json'
  })

  const completeGoals = completedGoalsJson.sort((a, b) => a.updated_at - b.updated_at)
  const incompleteGoals = incompleteGoalsJson.sort((a, b) => a.comments - b.comments)


  return { 
    goals: {
      complete: completeGoals,
      incomplete: incompleteGoals
    }
  }
};
