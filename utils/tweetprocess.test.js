const { deriveTitle, processTweet, getFullTweetText } = require('./tweetProcess');

describe('scout', () => {
	describe('getFullTweetText', () => {
		test('should return the full text, regardless of tweet_text being truncated or not', () => {
			const sampleNotTruncatedTweet = {
				text: '@30_ppo おめでとう!\n' +
				    'あなたの勝利!\n' +
				    '賀来賢人の“缶”敗です!\n' +
				    '\n' +
				    '@suntory のDMから\n' +
				    '無料引換クーポンをゲットしよう! https://t.co/Z4uZsH9lsA',
				truncated: false
			};
			const sampleTruncatedTweet = {
			  	text: '@sidd_sharma01 We will not be able to reveal the outcome of the investigation that is carried out internally, actio… https://t.co/1KvPmD9NAC',
				truncated: true,
				extended_tweet: {
					full_text: '@sidd_sharma01 We will not be able to reveal the outcome of the investigation that is carried out internally, action taken on the seller is completely internal information. Please keep us posted if the refund initiation is not fulfilled as suggested by our support team. ^MJ'
				}
			};
			let fullText1 = getFullTweetText(sampleTruncatedTweet);
			expect(fullText1).toBe(sampleTruncatedTweet.extended_tweet.full_text);

			let fullText2 = getFullTweetText(sampleNotTruncatedTweet);
			expect(fullText2).toBe(sampleNotTruncatedTweet.text);
		});
	})
	describe('deriveTitle', () => {
		test('should get a title from a tweet\'s text', () => {
			const sampleText = 'don\'t look I shy...\n\nbut also here\'s the link to look\n\nhttps://chaturbate.com/projektmelody/?force=1&join_overlay=1&campaign=wXffl&disable_sound=0&tour=dT8X&room=projektmelody';
			const title = deriveTitle(sampleText);
			expect(title).toBe('don\'t look I shy...  but also here\'s the link to look');
		})
	})
})