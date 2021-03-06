/*
 * Copyright (C) 2015 Stratio (http://stratio.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function () {
  'use strict';

  /*TRIGGER CONTROLLER*/
  angular
    .module('webApp')
    .controller('TriggerCtrl', TriggerCtrl);

  TriggerCtrl.$inject = ['PolicyModelFactory', 'TriggerModelFactory', 'TriggerService', 'OutputService'];

  function TriggerCtrl(PolicyModelFactory, TriggerModelFactory, TriggerService, OutputService) {
    var vm = this;

    vm.init = init;
    vm.addTrigger = addTrigger;
    vm.addOutput = addOutput;
    vm.changeSqlHelpVisibility = changeSqlHelpVisibility;

    vm.removeTrigger = TriggerService.removeTrigger;
    vm.isNewTrigger = TriggerService.isNewTrigger;
    vm.saveTrigger = TriggerService.saveTrigger;

    vm.init();

    function init() {
      vm.trigger = TriggerModelFactory.getTrigger();
      if (vm.trigger) {
        vm.triggerContext = TriggerModelFactory.getContext();
        vm.template = PolicyModelFactory.getTemplate().trigger;
        vm.outputsHelpLinks = PolicyModelFactory.getTemplate().helpLinks[4];
        vm.showSqlHelp = false;
        if (TriggerService.isEnabledHelpForSql()) {
          vm.sqlSourceItems = TriggerService.getSqlHelpSourceItems();
        }
        return OutputService.generateOutputNameList().then(function (outputList) {
          vm.policyOutputList = outputList;
        });
      }
    }

    function changeSqlHelpVisibility() {
      vm.showSqlHelp = !vm.showSqlHelp;
    }

    function addTrigger() {
      vm.form.$submitted = true;
      if (vm.form.$valid) {
        vm.form.$submitted = false;
        TriggerService.addTrigger();
        TriggerService.disableTriggerCreationPanel(false);
      }
    }

    function addOutput() {
      if (vm.selectedPolicyOutput && vm.trigger.outputs.indexOf(vm.selectedPolicyOutput) == -1) {
        vm.trigger.outputs.push(vm.selectedPolicyOutput);
      }
    }
  }
})();
