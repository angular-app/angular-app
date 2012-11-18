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
    it('should call setup a scope correctly', function () {
      var params = {
        $scope: $scope,
        $location: jasmine.createSpyObj('$location', ['path']),
        users: [ { $id: function() { return 'X'; }} ],
        project: {}
      };
      params.users.filter = jasmine.createSpy('filter');

      var ctrl = $controller('ProjectsEditCtrl', params);
      
      expect($scope.project).toBe(params.project);
      expect($scope.users).toBe(params.users);
      expect($scope.usersLookup).toEqual({ 'X': params.users[0] });
      expect($scope.project.teamMembers).toEqual([]);

      $scope.onSave();
      expect(params.$location.path).toHaveBeenCalled();

      $scope.onError();
      expect($scope.updateError).toBe(true);

      $scope.productOwnerCandidates();
      expect(params.users.filter).toHaveBeenCalled();
      $scope.scrumMasterCandidates();
      expect(params.users.filter).toHaveBeenCalled();
      $scope.teamMemberCandidates();
      expect(params.users.filter).toHaveBeenCalled();

      var pushTeamMember = spyOn($scope.project.teamMembers,'push');
      $scope.addTeamMember();
      expect(pushTeamMember).not.toHaveBeenCalled();

      $scope.selTeamMember = {};
      $scope.addTeamMember();
      expect(pushTeamMember).toHaveBeenCalled();
      expect($scope.selTeamMember).toBeUndefined();

      //TODO
      $scope.removeTeamMember();
    });
  });
});