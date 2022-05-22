// Import the plugins
import Uppy from '@uppy/core';
import XHRUpload from '@uppy/xhr-upload';
import Dashboard from '@uppy/dashboard';
import Form from '@uppy/form';
import GoogleDrive from '@uppy/google-drive';
import Dropbox from '@uppy/dropbox';
import AwsS3Multipart from '@uppy/aws-s3-multipart';
import Url from '@uppy/url';

// And their styles (for UI plugins)
// With webpack and `style-loader`, you can import them like this:
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'

const companionUrl = 'https://uppy.futureporn.net';

const uppy = new Uppy()
    .use(Form, {
        target: '#attribution-form'
    })
    .use(Dashboard, {
        target: '#upload-widget',
        inline: true,
        showProgressDetails: true,
        theme: 'auto',
        thumbnailWidth: 280,
        showLinkToFileUploadResult: false,
        showProgressDetails: false,
        hideUploadButton: false,
        hideRetryButton: false,
        hidePauseResumeButton: false,
        hideCancelButton: false,
        hideProgressAfterFinish: false,
        note: null,
        closeModalOnClickOutside: false,
        closeAfterFinish: false,
        disableStatusBar: false,
        disableInformer: false,
        disableThumbnailGenerator: false,
        disablePageScrollWhenModalOpen: true,
        animateOpenClose: false,
        fileManagerSelectionType: 'files',
        proudlyDisplayPoweredByUppy: false,
        showSelectedFiles: true,
        showRemoveButtonAfterComplete: false,
        browserBackButtonClose: false,
        autoOpenFileEditor: false,
        disableLocalFiles: false,
    })
    .use(GoogleDrive, { target: Dashboard, companionUrl })
    .use(Dropbox, { target: Dashboard, companionUrl })
    .use(AwsS3Multipart, {
      limit: 4,
      companionUrl,
    })
    .use(Url, {
      target: Dashboard,
      companionUrl,
    })


uppy.on('complete', (result) => {
    console.log('Upload complete! We’ve uploaded these files:', result.successful)
})


