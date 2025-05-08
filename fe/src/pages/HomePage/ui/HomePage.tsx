import {TopBar} from "@/widgets/TopBar";
import Button from "@/shared/ui/Button/Button"
const HomePage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold bg-primary">Home</h1>
      <Button label="이전 페이지로 돌아가기"/>
    </div>
  );
};

export default HomePage;
