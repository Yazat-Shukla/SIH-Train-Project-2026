def priority_value(priority_score):
    """
    Convert priority score into an integer value
    suitable for OR-Tools objective.
    """

    return int(float(priority_score) * 100)


def build_priority_objective(model, selected_variables, priority_scores):
    """
    Build the basic optimization objective.

    Higher-priority maintenance tasks receive higher
    objective weight.
    """

    objective_terms = []

    for selected_var, priority_score in zip(
        selected_variables,
        priority_scores
    ):
        objective_terms.append(
            priority_value(priority_score) * selected_var
        )

    model.Maximize(sum(objective_terms))

    return model