@isTest
public class ProjectCreatorControllerTest {

    @isTest
    static void testCreateProject() {
        // Your test data
        String projectName = 'Test Project';
        List<ProjectCreatorController.MilestoneWrapper> milestones = new List<ProjectCreatorController.MilestoneWrapper>();

        ProjectCreatorController.MilestoneWrapper milestone = new ProjectCreatorController.MilestoneWrapper();
        milestone.name = 'Test Milestone 1';
        
        List<ProjectCreatorController.ItemWrapper> items = new List<ProjectCreatorController.ItemWrapper>();
        ProjectCreatorController.ItemWrapper item1 = new ProjectCreatorController.ItemWrapper();
        item1.name = 'Test Item 1';
        item1.status = 'In Progress';
        items.add(item1);

        ProjectCreatorController.ItemWrapper item2 = new ProjectCreatorController.ItemWrapper();
        item2.name = 'Test Item 2';
        item2.status = 'Complete';
        items.add(item2);

        milestone.items = items;
        milestones.add(milestone);

        // Start Test
        Test.startTest();
        
        // Call the Apex method
        Id projectId = ProjectCreatorController.createProject(projectName, JSON.serialize(milestones));
        
        // Validate the output
        System.assertNotEquals(null, projectId, 'Project creation failed');

        // Additional assertions or verifications can be performed here

        Test.stopTest();
    }

    @isTest
    static void testCreateMilestones() {
        // Create a test project
        Project__c testProject = new Project__c(Name = 'Test Project');
        insert testProject;

        // Test Milestone data
        ProjectCreatorController.MilestoneWrapper milestone = new ProjectCreatorController.MilestoneWrapper();
        milestone.name = 'Test Milestone';

        // Test Item data
        List<ProjectCreatorController.ItemWrapper> items = new List<ProjectCreatorController.ItemWrapper>();

        ProjectCreatorController.ItemWrapper item1 = new ProjectCreatorController.ItemWrapper();
        item1.name = 'Item 1';
        item1.status = 'In Progress';
        items.add(item1);

        ProjectCreatorController.ItemWrapper item2 = new ProjectCreatorController.ItemWrapper();
        item2.name = 'Item 2';
        item2.status = 'Complete';
        items.add(item2);

        milestone.items = items;

        // Serialize test data
        String serializedMilestone = JSON.serialize(milestone);

        // Start Test
        Test.startTest();

        // Call the Apex method
        Id createdMilestoneId = ProjectCreatorController.createMilestones(testProject.Id, serializedMilestone);

        // Validate the output
        System.assertNotEquals(null, createdMilestoneId, 'Milestone creation failed');

        Test.stopTest();
    }

    @isTest
    static void testCreateItem() {
        // Create a test project
        Project__c testProject = new Project__c(Name = 'Test Project');
        insert testProject;

        // Create Milestone data
        Milestone__c testMilestone = new Milestone__c(Name = 'Test Project', Project__c = testProject.Id);
        insert testMilestone;

        ProjectCreatorController.ItemWrapper item1 = new ProjectCreatorController.ItemWrapper();
        item1.name = 'Item 1';
        item1.status = 'In Progress';

        // Serialize test data
        String serializedItem = JSON.serialize(item1);

        // Start Test
        Test.startTest();

        // Call the Apex method
        Id createdItemId = ProjectCreatorController.createItem(testMilestone.Id, serializedItem);

        // Validate the output
        System.assertNotEquals(null, createdItemId, 'Milestone creation failed');

        Test.stopTest();
    }

    @isTest
    static void testCreateProjectWithException() {
        Test.startTest();

        // Call the method with null projectId and milestoneReq
        try {
            ProjectCreatorController.createProject(null, null);
        } catch (AuraHandledException ex) {
            // Verify the exception message or other details as needed
            String expectedErrorMessage = 'Error creating Milestones: null';
            System.assertEquals(expectedErrorMessage, ex.getMessage(), 'Unexpected error message');
        }

        Test.stopTest();
    }

    @isTest
    static void testCreateMilestonesWithException() {
        Test.startTest();

        // Call the method with null projectId and milestoneReq
        try {
            ProjectCreatorController.createMilestones(null, null);
        } catch (AuraHandledException ex) {
            // Verify the exception message or other details as needed
            String expectedErrorMessage = 'Error creating Milestones: null';
            System.assertEquals(expectedErrorMessage, ex.getMessage(), 'Unexpected error message');
        }

        Test.stopTest();
    }


    @isTest
    static void testCreateItemWithException() {
        Test.startTest();

        // Call the method with null projectId and milestoneReq
        try {
            ProjectCreatorController.createItem(null, null);
        } catch (AuraHandledException ex) {
            // Verify the exception message or other details as needed
            String expectedErrorMessage = 'Error creating Milestones: null';
            System.assertEquals(expectedErrorMessage, ex.getMessage(), 'Unexpected error message');
        }

        Test.stopTest();
    }

}