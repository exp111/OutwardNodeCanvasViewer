function getActionText(action, summary = false) {
    var ret = "";
    console.log("Action: " + action.$type);
    if (action.$type == "NodeCanvas.Tasks.Actions.QuestAction_AddLogEntry") {
        if (summary) {
            ret += "AddLogEntry";
        } else {
            ret += "AddLogEntry: ";
            ret += action.statement._text;
        }
    } else {
        ret = action.$type;
    }
    return ret;
}

function getNodeText(node, summary = false) {
    var ret = "";
    console.log("Node: " + node.$type);
    if (node.$type == "NodeCanvas.StateMachines.QuestStep") {
        ret = "QuestStep: \n";
        let list = node._actionList;
        if (list != null) {
            let execution = list.executionMode == "ActionsRunInParallel" ? "Parallel" : "Sequence"
            if (summary)
                ret += "(" + execution + "): "
            else
                ret += "Execution: In" + execution + "\n";
            let actions = list.actions;
            for (let i = 0; i < actions.length; i++) {
                let action = actions[i];
                if (summary)
                    ret += getActionText(action, summary) + ", ";
                else
                    ret += "- " + getActionText(action, summary) + "\n";
            };
        }
    } else {
        ret += node.$type;
    }
    return ret;
}

function getConditionText(condition, summary = false) {
    var ret = "";
    console.log("Condition: " + condition.$type);
    if (condition.$type == "NodeCanvas.Framework.ConditionList") {
        let list = condition.conditions;
        ret += "Conditions: ";
        if (!summary)
            ret += "\n";

        if (list != null) {
            for (let i = 0; i < list.length; i++) {
                let subCondition = list[i];
                if (summary)
                    ret += getConditionText(subCondition, summary) + ", ";
                else
                    ret += "- " + getConditionText(subCondition, summary) + "\n";
            };
        }
    } else if (condition.$type == "NodeCanvas.Tasks.Conditions.Condition_QuestEventOccured") {
        if (summary) {
            ret += "QuestEventOccured"
        } else {
            ret += "QuestEventOccured: ";
            ret += condition.QuestEventRef.m_eventUID; //TODO: read from QuestEvents.xml
        }
    } else {
        ret = condition.$type;
    }
    return ret;
}

function getEdgeText(edge, summary = false) {
    var ret = "";
    console.log("Edge: " + edge.$type);
    if (edge.$type == "NodeCanvas.StateMachines.FSMConnection") {
        ret = "FSMConnection: \n";
        let condition = edge._condition;
        if (condition) {
            ret += getConditionText(condition, summary);
        }
    } else {
        ret += edge.$type;
    }
    return ret;
}