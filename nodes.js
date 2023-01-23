function getActionText(action) {
    var ret = "";
    console.log("Action: " + action.$type);
    switch (action.$type) {
        case "NodeCanvas.Tasks.Actions.QuestAction_AddLogEntry":
            ret += "AddLogEntry: ";
            ret += action.statement._text;
            break;
        case "NodeCanvas.Tasks.Actions.SetBoolean":
            ret += "SetBoolean: ";
            ret += action.boolVariable._name;
            ret += " = "
            ret += action.setTo ?? "True"; // defaults to true
            break;
        default:
            ret = action.$type;
            break;
    }
    return ret;
}

function getNodeText(node) {
    var ret = "";
    console.log("Node: " + node.$type);
    switch (node.$type) {
        case "NodeCanvas.StateMachines.QuestStep":
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
            break;
        default:
            ret += node.$type;
            break;
    }
    return ret;
}

function getConditionText(condition) {
    var ret = "";
    console.log("Condition: " + condition.$type);
    switch (condition.$type) {
        case "NodeCanvas.Framework.ConditionList":
            let list = condition.conditions;
            ret += "Conditions: \n";
            if (list != null) {
                for (let i = 0; i < list.length; i++) {
                    let subCondition = list[i];
                    ret += "- " + getConditionText(subCondition) + "\n";
                };
            }
            break;
        case "NodeCanvas.Tasks.Conditions.Condition_QuestEventOccured":
            ret += "QuestEventOccured: ";
            // transform uid into name
            let event = Global.events[condition.QuestEventRef.m_eventUID];
            if (event)
                ret += `${event.Name} (${condition.QuestEventRef.m_eventUID})`;
            else
                ret += condition.QuestEventRef.m_eventUID;
            break;
        case "NodeCanvas.Tasks.Conditions.CheckBoolean":
            ret += "CheckBoolean: ";
            ret += condition.valueA._name;
            ret += " == "
            if (condition.valueB == null)
                ret += "True"
            else if (condition.valueB._value == null) //TODO: seems like a false value isnt serialized??
                ret += "False"
            else
                ret += condition.valueB._value;
            break;
        default:
            ret = condition.$type;
            break;
    }
    return ret;
}

function getEdgeText(edge) {
    var ret = "";
    console.log("Edge: " + edge.$type);
    switch (edge.$type) {
        case "NodeCanvas.StateMachines.FSMConnection":
            ret = "FSMConnection: \n";
            let condition = edge._condition;
            if (condition) {
                ret += getConditionText(condition);
            }
            break;
        default:
            ret += edge.$type;
            break;
    }
    return ret;
}