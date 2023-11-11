import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from "lightning/navigation";
import createProject from '@salesforce/apex/ProjectCreatorController.createProject';

export default class ProjectCreatorLwc extends NavigationMixin(LightningElement) {
    @track projectName;
    @track milestones = [];
    isLoading = false;
    

    handleProjectNameChange(event) {
        this.projectName = event.target.value;
    }

    handleAddMilestone() {
        const milestoneInterface = {
            id: this.milestones.length + 1,
            name: "",
            items: [],
        }
        
        this.milestones.push(milestoneInterface);
    }

    handleDelMilestone() { 
        this.milestones.pop();
    }

    handleMilestoneChange(event) {
        const { milestoneId, milestoneName, items } = event.detail;
        let milestone = this.milestones.find(milestone => milestone.id === milestoneId);
        milestone.name = milestoneName;
        milestone.items = items;
    }

    handleSaveProject() {
        // Save Project logic here
        this.isLoading = true;
        try {
            if (!this.projectName) { 
                throw new Error(`Project name is requeried!`);
            }
    
            if (this.milestones.length > 0) { 
                if (this.milestones.find(milestone => !milestone.name)) {
                    throw new Error(`Milestone name is requeried!`);
                }
                this.milestones.forEach(milestone => {
                    if (milestone.items.find(item => !item.name || !item.status)) {
                        throw new Error(`All to-do Items informations are requeried!`);
                    }
                });
    
            }
    
            createProject({ projectName: this.projectName, milestones: JSON.stringify(this.milestones) })
                .then(result => {
                    // Handle success
                    this.showToast('Success!', `Project inserted with ID: ${result}`, 'success');
                    this.cleanFields();
                })
                .catch(error => {
                    // Handle error
                    throw new Error(`Error creating project: ${error}`);
                });
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
        this.milestones = [];
        this.projectName = '';
    }

    navigateToObjectList() {
        console.log('Entrou');
        // Navigate to the Projects__c object list page.
        this[NavigationMixin.Navigate]({
          type: "standard__objectPage",
          attributes: {
            objectApiName: "Project__c",
            actionName: "list",
          },state: {
            // 'filterName' is a property on the page 'state'
            // and identifies the target list view.
            // It may also be an 18 character list view id.
            filterName: "All", // or by 18 char '00BT0000002TONQMA4'
          },
        });
      }

    get hasMilestone() {
        if (this.milestones.length > 0) return true;
        return false;
    }
}
