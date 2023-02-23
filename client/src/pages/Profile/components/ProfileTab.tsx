import { useState } from "react";
import styled from "styled-components";

const S = {
  TabSection: styled.section`
    display: flex;
    width: 90%;
    height: 40vh;
    background-color: #e4e4e4;
    border-radius: 10px;
  `,
  Tab: styled.nav`
    width: 100%;
    height: 40px;
  `,
  TabList: styled.ul`
    display: flex;
    width: 100%;
    height: 100%;
    background-color: #fff;
  `,
  TabItem: styled.li`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18%;
    height: 100%;
    border-radius: 13px 13px 0px 0px;
    background-color: #f4f4f4;
    font-size: 18px;
    font-weight: bold;
  `,
  TabItemActive: styled.li`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18%;
    height: 100%;
    border-radius: 13px 13px 0px 0px;
    background-color: #e4e4e4;
    font-size: 18px;
    font-weight: bold;
  `,
};

const ProfileTab = () => {
  const [tab, setTab] = useState("요약");

  const changeTab = (name: string) => {
    setTab(name);
  };

  return (
    <S.TabSection>
      <S.Tab>
        <S.TabList>
          {tab == "요약" ? (
            <>
              <S.TabItemActive>요약</S.TabItemActive>
              <S.TabItem
                onClick={() => {
                  changeTab("그래프");
                }}
              >
                그래프
              </S.TabItem>
            </>
          ) : (
            <>
              <S.TabItem
                onClick={() => {
                  changeTab("요약");
                }}
              >
                요약
              </S.TabItem>
              <S.TabItemActive>그래프</S.TabItemActive>
            </>
          )}
        </S.TabList>
      </S.Tab>
    </S.TabSection>
  );
};

export default ProfileTab;
