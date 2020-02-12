# Background

This code displays a dynamic board of outbound trains from North and South station. The board is updated every 6 seconds.

# Thought process

I choose to use Javascript for this so that the user could watch the board update and change without having to refresh their browser.

I originally thought that this might be a good react app however, I walked back that idea because that would include a lot of overhead for an app that didn't have user interaction.

Looking through the API docs, I knew I wanted to use the prediction endpoint because it gave me real updates and results. I filtered the results from the API so that it only returned relevant results. Filtering included looking at predictions for North and South Station (`[stop]=place-sstat,place-north`); only commuter rail trains (`route_type=2`); only outbound trains, ie North or South Station are the first stop on the route (`stop_sequence=1`);

Using the `include` statement, I was able to gather all information for the entire display in 1 API call. This is advantageous because calls to a DB and through an API can be time consuming.

# Additional Enhancements

If I had additional time, I would ...
1. Added more error handling and provided a better display for the user if no results were returned.
2. Add tests to make sure that the individual components and smaller helper methods returned as expected.
3. Add more styling. Right now, the styling is pretty minimal. I copied the colors and tried to space out the board, Overall, the look could be enhanced.
4. Refactor the API calls. I read in the "best practices" tab that there is a way to stream data. I think it would be cool to stream the predictions and get instant updates.

# How to run

To run this and see this in action, navigate to the index.html file in your browser.

For example if the folder is saved in downloads`file:///Users/madeleinejohnson/Downloads/train-scedule-js`, navigate to `file:///Users/madeleinejohnson/Downloads/train-scedule-js/index.html` in my browser.
