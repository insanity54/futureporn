import Uppy from '@uppy/core';
import Dashboard from '@uppy/dashboard';
import Tus from '@uppy/tus';
import RemoteSources from '@uppy/remote-sources';
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import AwsS3Multipart from '@uppy/aws-s3-multipart';


export default function upload () {
  return {
    date: '',
    note: '',
    init () {
      const that = this
      const uppy = new Uppy({
        onBeforeUpload (files) {
          if (!that.date) {
            const msg = 'File is missing a Stream Date'
            uppy.info(msg, 'error')
            throw new Error(msg)
          }
        },
        restrictions: {
          maxNumberOfFiles: 1,
          // requiredMetaFields: [
          //   'announceUrl',
          //   'date'
          // ]
        },
      })
        .use(
          Dashboard,
          { 
            inline: true, 
            target: '#uppy-dashboard', 
            theme: 'auto',
            proudlyDisplayPoweredByUppy: false,
            disableInformer: false,
            // metaFields: [
            //   @todo maybe add meta fields once https://github.com/transloadit/uppy/issues/4427 is fixed
            //   {
            //     id: 'announceUrl',
            //     name: 'Stream Announcement URL',
            //     placeholder: 'this is a placeholder'
            //   },
            //   {
            //     id: 'note',
            //     name: 'Note'
            //   }
            //   {
            //     id: 'date',
            //     name: 'Stream Date (ISO 8601)',
            //     placeholder: '2022-12-30'
            //   },
            // ]
          }
        )
        .use(RemoteSources, {
          companionUrl: window.companionUrl,
          sources: ['Box', 'OneDrive', 'Dropbox', 'GoogleDrive', 'Url'],
        })
        .use(AwsS3Multipart, {
          limit: 6,
          companionUrl: window.companionUrl,
          companionHeaders: {
            Authorization: `Bearer ${Alpine.store('auth').jwt}`
          }
        })


      uppy.on('file-added', (file) => {
        if (!that.date) {
          uppy.info("Please add the Stream Date to metadata", 'info', 5000)
        }
      });


      uppy.on('complete', (result) => {
        // console.log('Upload complete! We’ve uploaded these files:', result.successful)
        // for each uploaded vod, create a Vod in Strapi
        result.successful.forEach(async (upload) => {
          const res = await fetch(`${Alpine.store('env').backend}/api/vod/createFromUppy`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${Alpine.store('auth').jwt}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              data: {
                date: that.date,
                videoSrcB2: {
                  key: upload.s3Multipart.key,
                  uploadId: upload.s3Multipart.uploadId
                },
                note: that.note,
              }
            })
          })

          if (res.ok) {
            uppy.info("Thank you. The VOD is queued for approval by a moderator.", 'success', 60000)
          } else {
            uppy.error("There was a problem while uploading. Please try again later.", 'error', 10000)
          }
        })

      })
    }  
  }
}