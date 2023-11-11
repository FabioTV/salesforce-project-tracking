public with sharing class ProjectCreatorController {
    @AuraEnabled(cacheable=false)
    public static Id createProject(String projectName, String milestones) {
        try {
            Project__c project = new Project__c(Name = projectName);
            insert project;

            if (project.Id != null && milestones != null) {
                List<MilestoneWrapper> milestonesWrapper = (List<MilestoneWrapper>)JSON.deserialize(
                    milestones,
                    List<MilestoneWrapper>.class
                );

                List<Milestone__c> milestoneList = new List<Milestone__c>();
                for (MilestoneWrapper milestone : milestonesWrapper) {
                    Milestone__c newMilestone = new Milestone__c(
                        Name = milestone.name,
                        Project__c = project.Id
                    );
                    milestoneList.add(newMilestone);
                }

                insert milestoneList;

                List<Item__c> itemList = new List<Item__c>();
                Integer iterator = 0;
                for (MilestoneWrapper milestone : milestonesWrapper) {
                    if (milestone.items != null) {
                        for (ItemWrapper item : milestone.items) {
                            Item__c newItem = new Item__c(
                                Name = item.name,
                                Status__c = item.status,
                                Milestone__c = milestoneList[iterator].Id
                            );
                            itemList.add(newItem);
                        }
                    }
                    iterator ++;
                }
                insert itemList;
            }
            
            return project.Id;
        } catch (Exception ex) {
            throw new AuraHandledException('Error creating Project: ' + ex.getMessage());
        }
    }

    @AuraEnabled(cacheable=false)
    public static Id createMilestones(Id projectId, String milestoneReq) {
        try {
            if (projectId != null) {
                MilestoneWrapper milestoneWrapper = (MilestoneWrapper) JSON.deserialize(
                    milestoneReq,
                    MilestoneWrapper.class
                );

                Milestone__c newMilestone = new Milestone__c(
                    Name = milestoneWrapper.name,
                    Project__c = projectId
                );

                insert newMilestone;

                if (milestoneWrapper.items.size() > 0) {
                    List<Item__c> itemList = new List<Item__c>();
                    for (ItemWrapper item : milestoneWrapper.items) {
                        Item__c newItem = new Item__c(
                            Name = item.name,
                            Status__c = item.status,
                            Milestone__c = newMilestone.Id
                        );
                        itemList.add(newItem);
                    }
                    insert itemList;
                }
                
                return newMilestone.id;
            }
            return null;
        } catch (Exception ex) {
            throw new AuraHandledException('Error creating Milestones: ' + ex.getMessage());
        }
    }

    @AuraEnabled(cacheable=false)
    public static Id createItem(Id milestoneId, String itemReq) {
        try {
            if (milestoneId != null && itemReq != null) {
                ItemWrapper itemWrapper = (ItemWrapper) JSON.deserialize(
                    itemReq,
                    ItemWrapper.class
                );
                Item__c newItem = new Item__c(
                    Name = itemWrapper.name,
                    Status__c = itemWrapper.status,
                    Milestone__c = milestoneId
                );
                insert newItem;
                return newItem.Id;
            }
            return null;
        } catch (Exception ex) {
            throw new AuraHandledException('Error creating Items: ' + ex.getMessage());
        }
    }

    public class MilestoneWrapper {
        @AuraEnabled public String name;
        @AuraEnabled public List<ItemWrapper> items;
    }

    public class ItemWrapper {
        @AuraEnabled public String name;
        @AuraEnabled public String status;
    }
}
