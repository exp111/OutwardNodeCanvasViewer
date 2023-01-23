function getActionText(action) {
    var ret = "";
    console.log("Action: " + action.$type);
    if (action.$type == "NodeCanvas.Tasks.Actions.QuestAction_AddLogEntry") {
        ret += "AddLogEntry: ";
        ret += action.statement._text;
    } else if (action.$type == "NodeCanvas.Tasks.Actions.SetBoolean") {
        ret += "SetBoolean: ";
        ret += action.boolVariable._name;
        ret += " = "
        ret += action.setTo ?? "True"; // defaults to true
    } else {
        ret = action.$type;
    }
    return ret;
}

function getNodeText(node) {
    var ret = "";
    console.log("Node: " + node.$type);
    if (node.$type == "NodeCanvas.StateMachines.QuestStep") {
        ret = "QuestStep: \n";
        let list = node._actionList;
        if (list != null) {
            let execution = list.executionMode == "ActionsRunInParallel" ? "Parallel" : "Sequence"
            ret += "Execution: In" + execution + "\n";
            let actions = list.actions;
            for (let i = 0; i < actions.length; i++) {
                let action = actions[i];
                ret += "- " + getActionText(action) + "\n";
            };
        }
    } else {
        ret += node.$type;
    }
    return ret;
}

function getConditionText(condition) {
    var ret = "";
    console.log("Condition: " + condition.$type);
    if (condition.$type == "NodeCanvas.Framework.ConditionList") {
        let list = condition.conditions;
        ret += "Conditions: \n";

        if (list != null) {
            for (let i = 0; i < list.length; i++) {
                let subCondition = list[i];
                ret += "- " + getConditionText(subCondition) + "\n";
            };
        }
    } else if (condition.$type == "NodeCanvas.Tasks.Conditions.Condition_QuestEventOccured") {
        ret += "QuestEventOccured: ";
        // transform uid into name
        let event = Global.events[condition.QuestEventRef.m_eventUID];
        if (event)
            ret += `${event.Name} (${condition.QuestEventRef.m_eventUID})`;
        else
            ret += condition.QuestEventRef.m_eventUID;
    } else {
        ret = condition.$type;
    }
    return ret;
}

function getEdgeText(edge) {
    var ret = "";
    console.log("Edge: " + edge.$type);
    if (edge.$type == "NodeCanvas.StateMachines.FSMConnection") {
        ret = "FSMConnection: \n";
        let condition = edge._condition;
        if (condition) {
            ret += getConditionText(condition);
        }
    } else {
        ret += edge.$type;
    }
    return ret;
}