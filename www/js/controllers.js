angular.module('starter.controllers', [])
    .controller('TodoCtrl', function ($scope, $timeout, $ionicModal, Projects, $ionicSideMenuDelegate) {

        // this function creates the new project
        // using the projectTitle
        var createProject = function (projectTitle) {
                var newProject = Projects.newProject(projectTitle);
                $scope.projects.push(newProject);
                Projects.save($scope.projects);
                $scope.selectProject(newProject, $scope.projects.length - 1);
            }
            // Load projects
        $scope.projects = Projects.all();

        //Call the last active, or the first project
        $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];

        // Called to create a new project
        $scope.newProject = function () {
            var projectTitle = prompt('Project name');
            if (projectTitle) {
                createProject(projectTitle);
            }
        };

        // Called to select the given project
        $scope.selectProject = function (project, index) {
            $scope.activeProject = project;
            Projects.setLastActiveIndex(index);
            $ionicSideMenuDelegate.toggleLeft(false);
        };

        // Create our modal
        $ionicModal.fromTemplateUrl('new-task.html', function (modal) {
            $scope.taskModal = modal;
        }, {
            scope: $scope
        });

        //call-functions
        $scope.createTask = function (task) {
            if (!$scope.activeProject || !task) {
                return;
            }
            $scope.activeProject.tasks.push({
                title: task.title
            });
            $scope.taskModal.hide();

            // saves all the projects
            Projects.save($scope.projects);

            task.title = "";
        };

        $scope.newTask = function () {
            $scope.taskModal.show();
        };

        $scope.closeNewTask = function () {
                $scope.taskModal.hide();
            }
            //deletes a project that is picked
        $scope.onItemDelete = function (item) {
                $scope.projects.splice($scope.projects.indexOf(item), 1);
                //after deleting a project all remaining projects are re-saved
                // if no projects exist you will be asked to enter first project
                // same as opening app for the first time. 
                Projects.save($scope.projects);

            }
            // slides the project to the left
            //so a new project can be created
        $scope.toggleProjects = function () {
            $ionicSideMenuDelegate.toggleLeft();
        };


        //saves the checked box state on the new task list within 
        // the project
        $scope.doneClicked = function (i, task) {
            //ion-checkbox input to note complete tasks
            if (!$scope.activeProject || !task) {
                return;
            }
            Projects.save($scope.projects);
        }



        // Try to create the first project, 
        $timeout(function () {
            if ($scope.projects.length == 0) {
                while (true) {
                    var projectTitle = prompt('Your first project title:');
                    if (projectTitle) {
                        createProject(projectTitle);
                        break;
                    }
                }
            }
        });

    });
