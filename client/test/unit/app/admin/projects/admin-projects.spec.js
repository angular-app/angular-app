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
        i18nNotifications: jasmine.createSpyObj('i18nNotifications', ['pushForCurrentRoute', 'pushForNextRoute']),
        users: [ { $id: function() { return 'X'; }} ],
        project: { $id: function() { return 'Y'; }}
      };
      params.users.filter = jasmine.createSpy('filter');
      ctrl = $controller('ProjectsEditCtrl', params);
    });
    it('should call setup a scope objects correctly', function () {
      expect($scope.project).toBe(params.project);
      expect($scope.users).toBe(params.users);
    });
    it('should call $location and display a success message in onSave', function() {
      $scope.onSave(params.project);
      expect(params.i18nNotifications.pushForNextRoute).toHaveBeenCalled();
      expect(params.i18nNotifications.pushForNextRoute.mostRecentCall.args[1]).toBe('success');
      expect(params.$location.path).toHaveBeenCalled();
    });
    it('should display an error message in onError', function() {
      $scope.onError();
      expect(params.i18nNotifications.pushForCurrentRoute).toHaveBeenCalled();
      expect(params.i18nNotifications.pushForCurrentRoute.mostRecentCall.args[1]).toBe('error');
    });
  });

  describe('TeamMembersController', function () {
    var params, ctrl, users;
    beforeEach(function () {
      params = { $scope: $scope };
      users = [ { $id: function () { return 'X'; }}];
      users.filter = jasmine.createSpy('filter');
      $scope.users = users;
      $scope.project = { $id: function () { return 'Y'; }};
      ctrl = $controller('TeamMembersController', params);
    });
    it('should call setup a scope objects correctly', function () {
      expect($scope.usersLookup).toEqual({ 'X': users[0] });
      expect($scope.project.teamMembers).toEqual([]);
    });
    it('should call filter when getting candidates', function () {
      $scope.productOwnerCandidates();
      expect(users.filter).toHaveBeenCalled();
      $scope.scrumMasterCandidates();
      expect(users.filter).toHaveBeenCalled();
      $scope.teamMemberCandidates();
      expect(users.filter).toHaveBeenCalled();
    });
    it('should push items into team members array in addTeamMember only if a team member is selected', function() {
      expect($scope.project.teamMembers.length).toBe(0);
      $scope.addTeamMember();
      expect($scope.project.teamMembers.length).toBe(0);

      var someTeamMember = {};
      $scope.selTeamMember = someTeamMember;
      $scope.addTeamMember();
      expect($scope.project.teamMembers.length).toBe(1);
      expect($scope.project.teamMembers[0]).toBe(someTeamMember);
      expect($scope.selTeamMember).toBeUndefined();
    });
    it('should remove the specified team member only if it is in the team members array', function() {
      var someTeamMember = {};
      var otherTeamMember = {};
      $scope.project.teamMembers.push(someTeamMember);
      $scope.removeTeamMember(someTeamMember);
      expect($scope.project.teamMembers.length).toBe(0);

      $scope.project.teamMembers.push(someTeamMember);
      $scope.removeTeamMember(otherTeamMember);
      expect($scope.project.teamMembers.length).toBe(1);
    });
  });
});