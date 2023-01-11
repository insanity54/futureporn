# futureporn-commander

listens to messages and coordinates actions


## Redis Pub/Sub Message Specifications

All messages include

  * sender ID
  * timestamp



### Scout

Says, "I see a CB invite tweet. Here is the link." 
Says, "I see a CB stream that just started."
Says, "I see a CB stream that just stopped."



### Capture

Says, "I am starting capture."
Says, "I am stopping capture, here is the metadata."

```js
// Stream object
{
	room: 'projektmelody',
	streamStart: '2023-01-10T06:32:00.000Z',
	streamEnd: '2023-01-10T07:00:00.000Z',
	fileNames: [
		'projektmelody 2023-01-09 22_32-projektmelody.mp4',
		'projektmelody 2023-01-09 23_00-projektmelody.mp4'
	],
	videoSrcHash: 'bafybeibmpishntx3kv6lckeewixuvrghzclmn47b4723akalhdpjmblhaa'
}
```


### Commander





### Builder

