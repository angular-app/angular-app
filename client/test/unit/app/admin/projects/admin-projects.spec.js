describe('admin projects', function () {

  beforeEach(module('admin-projects'));

  describe('ProjectsListCtrl', function () {
    it('should call crudListMethods', inject(function($controller, $rootScope) {
      var locals = {
            $scope: $rootScope,
            crudListMethods: jasmine.createSpy('crudListMethods'),
            projects: {}
          };
      var ctrl = $controller('ProjectsListCtrl', locals);
      expect($rootScope.projects).toBe(locals.projects);
      expect(locals.crudListMethods).toHaveBeenCalled();
    }));
  });

  describe('ProjectsEditCtrl', function () {

    function createLocals() {
      return {
        $scope: {},
        $location: jasmine.createSpyObj('$location', ['path']),
        i18nNotifications: jasmine.createSpyObj('i18nNotifications', ['pushForCurrentRoute', 'pushForNextRoute']),
        users: [ { $id: function() { return 'X'; }, filter: jasmine.createSpy('filter') } ],
        project: { $id: function() { return 'Y'; } }
      };
    }

    function runController(locals) {
      inject(function($controller) {
        $controller('ProjectsEditCtrl', locals);
      });
    }


    it('should call setup a scope objects correctly', function() {
      var locals = createLocals();
      runController(locals);
      expect(locals.$scope.project).toBe(locals.project);
      expect(locals.$scope.users).toBe(locals.users);
    });


    it('should call $location and display a success message in onSave', function() {
      var locals = createLocals();
      runController(locals);

      locals.$scope.onSave(locals.project);

      expect(locals.i18nNotifications.pushForNextRoute).toHaveBeenCalled();
      expect(locals.i18nNotifications.pushForNextRoute.mostRecentCall.args[1]).toBe('success');
      expect(locals.$location.path).toHaveBeenCalled();
    });


    it('should display an error message in onError', function() {
      var locals = createLocals();
      runController(locals);

      locals.$scope.onError();

      expect(locals.i18nNotifications.pushForCurrentRoute).toHaveBeenCalled();
      expect(locals.i18nNotifications.pushForCurrentRoute.mostRecentCall.args[1]).toBe('error');
    });
  });

  describe('TeamMembersController', function () {
    function createProject() {
      return {
        $id: function () { return 'Y'; }
      };
    }
    function createUsers() {
      var users = [ {
        $id: function() { return 'X'; }
      } ];
      users.filter = jasmine.createSpy('filter');
      return users;
    }
    function createLocals() {
      return {
        $scope: {
          project: createProject(),
          users: createUsers()
        }
      };
    }
    function runController(locals) {
      inject(function($controller) {
        $controller('TeamMembersController', locals);
      });
    }

    describe('scope setup', function() {
      it('should attach a users lookup', function () {
        var locals = createLocals();
        runController(locals);

        expect(locals.$scope.usersLookup).toEqual({ 'X': locals.$scope.users[0] });
      });

      
      it('should attach an empty team members array', function() {
        var locals = createLocals();
        runController(locals);
       
        expect(locals.$scope.project.teamMembers).toEqual([]);

      });
    });

    describe('candidates', function() {

      it('should call filter when getting candidates', function () {
        var locals = createLocals();
        runController(locals);

        var $scope = locals.$scope,
            filterSpy = locals.$scope.users.filter;

        $scope.productOwnerCandidates();
        expect(filterSpy).toHaveBeenCalled();
        $scope.scrumMasterCandidates();
        expect(filterSpy).toHaveBeenCalled();
        $scope.teamMemberCandidates();
        expect(filterSpy).toHaveBeenCalled();
      });
    });

    describe('addTeamMember()', function() {

      it('should not push an item into team members array if no team member is selected', function() {
        var locals = createLocals();
        runController(locals);

        var $scope = locals.$scope;

        expect($scope.project.teamMembers.length).toBe(0);
        $scope.addTeamMember();
        expect($scope.project.teamMembers.length).toBe(0);
      });

      it('should push the selected item into team members array', function() {

        var locals = createLocals();
        runController(locals);

        var $scope = locals.$scope;

        var someTeamMember = {};
        $scope.selTeamMember = someTeamMember;
        $scope.addTeamMember();

        expect($scope.project.teamMembers.length).toBe(1);
        expect($scope.project.teamMembers[0]).toBe(someTeamMember);
        expect($scope.selTeamMember).toBeUndefined();
      });
    });

    describe('removeTeamMember', function(){

      it('should remove the specified team member if it is in the team members array', function() {
        var locals = createLocals();
        runController(locals);

        var $scope = locals.$scope;

        var someTeamMember = {};
        $scope.project.teamMembers.push(someTeamMember);
        $scope.removeTeamMember(someTeamMember);
        expect($scope.project.teamMembers.length).toBe(0);
      });

      it('should not affect the array if the specified member is not already in the array', function() {
        var locals = createLocals();
        runController(locals);

        var $scope = locals.$scope;
        var someTeamMember = {};
        var otherTeamMember = {};
        $scope.project.teamMembers.push(someTeamMember);
        $scope.removeTeamMember(otherTeamMember);
        expect($scope.project.teamMembers.length).toBe(1);
      });
    });
  });
});