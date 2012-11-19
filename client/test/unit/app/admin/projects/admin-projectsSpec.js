describe('admin projects', function () {

  var $scope;
  var $controller;
  beforeEach(module('admin-projects'));
  beforeEach(inject(function ($injector) {
    $scope = $injector.get('$rootScope');
    $controller = $injector.get('$controller');
  }));

  describe('ProjectsListCtrl', function () {
    it('should call crudListMethods', function () {
      var params = {
        $scope: $scope,
        crudListMethods: jasmine.createSpy('crudListMethods'),
        projects: {}
      };
      var ctrl = $controller('ProjectsListCtrl', params);
      expect($scope.projects).toBe(params.projects);
      expect(params.crudListMethods).toHaveBeenCalled();
    });
  });

  describe('ProjectsEditCtrl', function () {
    var params, ctrl;
    beforeEach(function() {
      params = {
        $scope: $scope,
        $location: jasmine.createSpyObj('$location', ['path']),
        users: [ { $id: function() { return 'X'; }} ],
        project: {}
      };
      params.users.filter = jasmine.createSpy('filter');
      ctrl = $controller('ProjectsEditCtrl', params);
    });
    it('should call setup a scope objects correctly', function () {
      expect($scope.project).toBe(params.project);
      expect($scope.users).toBe(params.users);
      expect($scope.usersLookup).toEqual({ 'X': params.users[0] });
      expect($scope.project.teamMembers).toEqual([]);
    });
    it('should call $location in onSave', function() {
      $scope.onSave();
      expect(params.$location.path).toHaveBeenCalled();
    });
    it('should set updateError in onError', function() {
      $scope.onError();
      expect($scope.updateError).toBe(true);
    });
    it('should call filter when getting candidates', function() {
      $scope.productOwnerCandidates();
      expect(params.users.filter).toHaveBeenCalled();
      $scope.scrumMasterCandidates();
      expect(params.users.filter).toHaveBeenCalled();
      $scope.teamMemberCandidates();
      expect(params.users.filter).toHaveBeenCalled();
    });
    it('should push items into team members array in addTeamMember only if a team member is selected', function() {
      var pushTeamMember = spyOn($scope.project.teamMembers,'push');
      $scope.addTeamMember();
      expect(pushTeamMember).not.toHaveBeenCalled();

      $scope.selTeamMember = {};
      $scope.addTeamMember();
      expect(pushTeamMember).toHaveBeenCalled();
      expect($scope.selTeamMember).toBeUndefined();
    });
    it('should remove the specified team member if it is in the team members array', function() {
      var indexOfTeamMembers = spyOn($scope.project.teamMembers,'indexOf').andReturn(-1);
      $scope.removeTeamMember();
      expect(indexOfTeamMembers).toHaveBeenCalled();
      
      indexOfTeamMembers.andReturn(0);
      spliceTeamMembers = spyOn($scope.project.teamMembers,'splice');
      $scope.removeTeamMember();
      expect(indexOfTeamMembers).toHaveBeenCalled();
      expect(spliceTeamMembers).toHaveBeenCalled();
    });
  });
});