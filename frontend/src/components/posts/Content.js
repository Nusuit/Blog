import React from 'react';
import RankingBox from './RankingBox';
import '../../styles/components/posts/Content.css';

const Content = () => {
  const dailyPosts = [
    {
      title: "1. Hôm nay tôi dui",
      preview: "Hôm nay là một ngày dui ...",
      likes: 500,
      topic: "Tech"
    },
    {
      title: "2. Hôm nay tôi buồn",
      preview: "Hôm nay là một ngày buồn ...",
      likes: 450,
      topic: "Sea"
    },
    {
      title: "3. Hôm nay lớp đi học đông vậy",
      preview: "Hôm nay tự dưng lớp tôi đi rất đầy đủ",
      likes: 449,
      topic: "School"
    }
  ];

  const monthlyPosts = [
    {
      title: "1. Hôm nay là thứ 2",
      preview: "Hôm nay là thứ 2 ...",
      likes: 1500,
      topic: "School"
    },
    {
      title: "2. Hôm nay là thứ 3",
      preview: "Hôm nay là thứ 3 ...",
      likes: 1000,
      topic: "Social"
    },
    {
      title: "3. Hôm nay tôi dui",
      preview: "Hôm nay là một ngày dui ...",
      likes: 500,
      topic: "Tech"
    }
  ];

  return (
    <div className="content">
      <RankingBox title="Ranking: Daily" posts={dailyPosts} />
      <RankingBox title="Ranking: Monthly" posts={monthlyPosts} />
    </div>
  );
};

export default Content;