import { LightningElement, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createItem from '@salesforce/apex/ProjectCreatorController.createItem';

const STATUS_OPTIONS = [
    { label: 'Not Started', value: 'Not Started' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Complete', value: 'Complete' }
    // Add more status options as needed
];

export default class ItemCreatorLwc extends LightningElement {
    @api recordId;
    @api objectApiName;
    @api itemId;
    @api hasParent = false;
    itemName = '';
    itemStatus = 'Not Started';
    isLoading = false;

    statusOptions = STATUS_OPTIONS;

    handleItemNameChange(event) {
        this.itemName = event.target.value;
        const sendChange = new CustomEvent('itemchange', {
            detail: { itemId: this.itemId, itemName: this.itemName, itemStatus: this.itemStatus }
        });
        this.dispatchEvent(sendChange);
    }

    handleItemStatusChange(event) {
        this.itemStatus = event.target.value;
        const sendChange = new CustomEvent('itemchange', {
            detail: { itemId: this.itemId, itemName: this.itemName, itemStatus: this.itemStatus }
        });
        this.dispatchEvent(sendChange);
    }

    handleSaveItem() {
        // Save Item logic here
        this.isLoading = true;
        try {
            if (!this.itemName) {
                throw new Error(`Item name is requeried!`);
            }
            if (!this.itemStatus) {
                throw new Error(`Item status is requeried!`);
            }
            if (this.objectApiName === "Milestone__c" && this.recordId) {
                const item = {
                    name: this.itemName,
                    status: this.itemStatus
                }
                createItem({ milestoneId: this.recordId, itemReq: JSON.stringify(item) })
                .then(result => {
                    // Handle success
                    this.showToast('Success!', `Item inserted with ID: ${result}`, 'success');
                    this.cleanFields();
                })
                .catch(error => {
                    // Handle error
                    throw new Error(`Error creating item: ${error}`);
                });
            }
        } catch (e) {
            this.showToast('Error!', e.message, 'error');
        }
        this.isLoading = false;
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }

    cleanFields() {
        this.itemName = '';
        this.itemStatus = 'Not Started';
    }

    get title() { 
        if (this.hasParent) return `To-do Item ${this.itemId}`;
        return "Create To-do Item";
    }

    get classStyle() { 
        if (this.hasParent) return 'slds-box slds-box_small slds-m-top_small';
        return "";
    }
}
