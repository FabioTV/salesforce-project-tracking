import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createProject from '@salesforce/apex/ProjectCreatorController.createProject';

export default class ProjectCreatorLwc extends LightningElement {
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

    get hasMilestone() {
        if (this.milestones.length > 0) return true;
        return false;
    }
}
