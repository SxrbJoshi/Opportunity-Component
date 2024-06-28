import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import uploadFile from '@salesforce/apex/fileUploadController.uploadFile';
export default class FileComp extends LightningElement {
    @track fileNames = [];
    files = [];
    handleFilesChange(event) {
        if (event.target.files.length > 0) {
            this.files = event.target.files;
            this.fileNames = Array.from(this.files).map(file => file.name);
        }
    }
    handleUpload() {
        if (this.files.length > 0) {
            const file = this.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(',')[1];
                this.uploadFileToServer(file, base64);
            };
            reader.readAsDataURL(file);
        } else {
            this.showToast('Error', 'Please select a file to upload.', 'error');
        }
    }
    uploadFileToServer(file, base64Data) {
        uploadFile({ fileName: file.name, base64Data: base64Data })
            .then(() => {
                this.showToast('Success', 'File uploaded successfully.', 'success');
                this.fileNames = [];
                this.files = [];
            })
            .catch(error => {
                this.showToast('Error', error.body.message, 'error');
            });
    }
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }
}