describe('ProjectsViewCtrl', function() {

  beforeEach(module('projects'));

  function runController($scope, projects) {
    inject(function($controller) {
      $controller('ProjectsViewCtrl', { $scope: $scope, projects: projects });
    });
  }

  function createMockProject(id) {
    return {
      $id: function() { return id; },
      getRoles: jasmine.createSpy('getRoles')
    };
  }

  function createMockProjectList() {
    return [ createMockProject('project-id') ];
  }

  it("attaches the list of projects to the scope", function() {
    var $scope = {},
        projects = createMockProjectList();

    runController($scope, projects);
    expect($scope.projects).toBe(projects);
  });

  describe('viewProject(projectId)', function() {
    var $scope = {},
        projects = createMockProjectList();

    it('changes the location', inject(function($location) {
      spyOn($location, 'path');
      runController($scope, projects);

      $scope.viewProject(projects[0]);

      expect($location.path).toHaveBeenCalledWith('/projects/project-id');
    }));
  });

  describe('manageBacklog(projectId)', function() {
    var $scope = {},
        projects = createMockProjectList();

    it('changes the location', inject(function($location) {
      spyOn($location, 'path');
      runController($scope, projects);

      $scope.manageBacklog(projects[0]);

      expect($location.path).toHaveBeenCalledWith('/projects/project-id/productbacklog');
    }));
  });

  describe('manageSprints(projectId)', function() {
    var $scope = {},
        projects = createMockProjectList();

    it('changes the location', inject(function($location) {
      spyOn($location, 'path');
      runController($scope, projects);

      $scope.manageSprints(projects[0]);

      expect($location.path).toHaveBeenCalledWith('/projects/project-id/sprints');
    }));
  });

  describe('getMyRoles(project)', function() {
    var $scope = {},
        projects = createMockProjectList();

    it('calls getRoles on the project with the current user', inject(function(security) {
      security.currentUser = { id: 'current-user-id'};
      runController($scope, projects);
      $scope.getMyRoles(projects[0]);
      expect(projects[0].getRoles).toHaveBeenCalledWith('current-user-id');
    }));

  });
});