// Transforms a quest event uid into the name
function getEventName(eventRef)
{
    let event = Global.events[eventRef.m_eventUID];
    if (event)
        return `${event.Name} (${eventRef.m_eventUID})`;
    else
        return eventRef.m_eventUID;
}

function getStatementText(statement)
{
    if (statement)
        return `${statement._text} (${statement._meta})`; //TODO: some statements dont have meta tags
    else
        return "undefined"; //TODO: happens?
}

function getActionText(action) {
    var ret = "";
    console.log("Action: " + action.$type);
    switch (action.$type) {
        case "NodeCanvas.Tasks.Actions.QuestAction_AddLogEntry":
            ret += "AddLogEntry: ";
            ret += getStatementText(action.statement);
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

function getActionNodeText(node)
{
    ret = "";
    console.log("ActionNode: " + node.$type);
    switch (node.$type) {
        case "NodeCanvas.Framework.ActionList":
        {
            let list = node.actions;
            ret += "Actions: \n";
            if (list != null) {
                for (let i = 0; i < list.length; i++) {
                    let subAction = list[i];
                    ret += "- " + getActionNodeText(subAction) + "\n";
                };
            }
            break;
        }
        case "NodeCanvas.Tasks.Actions.SendQuestEvent":
        {
            ret = "SendQuestEvent: ";
            ret += getEventName(node.QuestEventRef);
            break;
        }
        case "NodeCanvas.Tasks.Actions.GiveReward":
        {
            ret = "GiveReward: ";
            ret += `Silver: ${node.SilverAmount._value ?? 0}, `;
            ret += `XP: ${node.XpAmount._value ?? 0}, `;
            ret += "Items: ";
            for (let i = 0; i < node.ItemReward.length; i++)
            {
                let reward = node.ItemReward[i];
                ret += `${reward.Quantity._value}x ${reward.Item._value.m_itemID}, `
            }
            break;
        }
        default:
            ret += node.$type;
            break;
    }
    return ret;
}

function getNodeText(node) {
    var ret = "";
    console.log("Node: " + node.$type);
    switch (node.$type) {
        case "NodeCanvas.StateMachines.QuestStep":
        {
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
        }
        // Dialogue
        case "NodeCanvas.DialogueTrees.ConditionNode":
        {
            ret = "ConditionNode: \n";
            let condition = node._condition;
            if (condition) {
                ret += getConditionText(condition);
            }
            break;
        }
        case "NodeCanvas.DialogueTrees.ActionNode":
        {
            ret = "ActionNode: \n";
            let action = node._action;
            if (action) {
                ret += getActionNodeText(action);
            }
            break;
        }
        case "NodeCanvas.DialogueTrees.FinishNode":
            ret = "FinishNode: (";
            ret += node.finishState ?? "Success"; // defaults to success // Example Failure in data/dialogues/merchants/Dialogue_Merchant_CaravanFastTravel.json
            ret += ")";
            break;
        case "NodeCanvas.DialogueTrees.StatementNodeExt":
            ret = "StatementNode: \n";
            if (node.statement)
            {
                ret += getStatementText(node.statement);
            }
            break;
        case "NodeCanvas.DialogueTrees.MultipleChoiceNodeExt":
        {
            ret = "MultipleChoiceNode: \n";
            let list = node.availableChoices;
            if (list != null) {
                ret += "Choices: \n";
                for (let i = 0; i < list.length; i++) {
                    let statement = list[i];
                    ret += "- " + getStatementText(statement.statement) + "\n";
                };
            }
            break;
        }
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
        {
            let list = condition.conditions;
            ret += "Conditions: \n";
            if (list != null) {
                for (let i = 0; i < list.length; i++) {
                    let subCondition = list[i];
                    ret += "- " + getConditionText(subCondition) + "\n";
                };
            }
            break;
        }
        case "NodeCanvas.Tasks.Conditions.Condition_QuestEventOccured":
        {
            ret += "QuestEventOccured: ";
            ret += getEventName(condition.QuestEventRef);
            break;
        }
        case "NodeCanvas.Tasks.Conditions.CheckBoolean":
        {
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
        }
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
        case "NodeCanvas.DialogueTrees.DTConnection":
            ret = "DTConnection"; // nothing else
            break;
        default:
            ret += edge.$type;
            break;
    }
    return ret;
}