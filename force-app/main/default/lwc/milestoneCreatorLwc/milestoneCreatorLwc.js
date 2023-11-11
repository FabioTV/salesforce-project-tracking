import { LightningElement, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createMilestones from '@salesforce/apex/ProjectCreatorController.createMilestones';

export default class MilestoneCreatorLwc extends LightningElement {
    //@track milestoneName;
    @track items = [];
    @api recordId;
    @api objectApiName;
    @api milestoneId;
    @api hasParent = false;
    milestoneName = '';
    isLoading = false;

    handleMilestoneNameChange(event) {
        //this.milestone.name = event.target.value;
        this.milestoneName = event.target.value;
        const sendChange = new CustomEvent('milestonechange', {
            detail: { milestoneId: this.milestoneId, milestoneName: this.milestoneName, items: this.items }
        });
        this.dispatchEvent(sendChange);
    }

    handleItemChange(event) {
        const { itemId, itemName, itemStatus } = event.detail;
        let item = this.items.find(item => item.id === itemId);
        item.name = itemName;
        item.status = itemStatus;
        const sendChange = new CustomEvent('milestonechange', {
            detail: { milestoneId: this.milestoneId, milestoneName: this.milestoneName, items: this.items }
        });
        this.dispatchEvent(sendChange);
    }

    handleAddItem() {
        this.items = [...this.items, { id: this.items.length + 1 }];
        const sendChange = new CustomEvent('milestonechange', {
            detail: { milestoneId: this.milestoneId, milestoneName: this.milestoneName, items: this.items }
        });
        this.dispatchEvent(sendChange);
    }

    handleDelItem() {
        this.items.pop();
    }

    handleSaveMilestone() {
        // Save Milestone logic here
        this.isLoading = true;
        try {
            if (!this.milestoneName) {
                throw new Error(`Milestone name is requeried!`);
            }
    
            if (this.items.find(item => !item.name || !item.status)) {
                throw new Error(`All to-do Items informations are requeried!`);
            }
    
            if (this.objectApiName === "Project__c" && this.recordId) {
                const milestone = {
                    name: this.milestoneName,
                    items: this.items
                }
                createMilestones({ projectId: this.recordId, milestoneReq: JSON.stringify(milestone) })
                .then(result => {
                    // Handle success
                    this.showToast('Success!', `Milestone inserted with ID: ${result}`, 'success');
                    this.cleanFields();
                })
                .catch(error => {
                    // Handle error
                    throw new Error(`Error creating milestone: ${error}`);
                });
                this.isLoading = false;
            }
            this.isLoading = false;
            
        } catch (e) {
            this.isLoading = false;
            this.showToast('Error!', e.message, 'error');
        }
        
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
        this.items = [];
        this.milestoneName = '';
    }

    get hasItems() {
        if (this.items.length > 0) return true;
        return false;
    }

    get title() { 
        if (this.hasParent) return `Milestone ${this.milestoneId}`;
        return "Create Milestone";
    }

    get classStyle() { 
        if (this.hasParent) return 'slds-box slds-box_small slds-m-top_small';
        return "";
    }
}
