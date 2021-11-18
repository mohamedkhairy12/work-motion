const FristName = (state = "amr", action) => {
    switch (action.type) {
      case "test":
        return action.payload; 
      default:
        return state;
    }

  };

  export default FristName; 