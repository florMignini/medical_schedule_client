
const DinamicAllergieContent = ({allergiesType}:any) => {
    const renderSwitch = (allergie:string) => {
        switch (allergie) {
          case 'option1':
            return <div>Option 1 Selected</div>;
          case 'option2':
            return <div>Option 2 Selected</div>;
          case 'option3':
            return <div>Option 3 Selected</div>;
          default:
            return <div>No Option Selected</div>;
        }
      };
    console.log(allergiesType)
      return (
        <div>
          {renderSwitch(allergiesType)}
        </div>
      );
}

export default DinamicAllergieContent;