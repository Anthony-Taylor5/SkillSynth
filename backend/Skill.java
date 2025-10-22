

public class Skill {

    final float maxLevel = 5;

    private String name;

    private int level;

    private int xp;

    public Skill()
    {
        this.name = "undefined";
        level = 0;
        xp = 0;
    }

    public Skill(String name, int initLevel)
    {
        this.name = name;
        this.level = initLevel;
        xp = 0;
    }

    public void addXP(int xp)
    {
        this.xp += xp;
        updateLevel();
    }

    public String getName()
    {
        return name;
    }

    private void updateLevel()
    {
        if (level >= maxLevel)
        {
            return;
        }
        if (xp >= xpToNextLevel())
        {
            level++;
        }
    }

    public int xpToNextLevel()
    {
        return -1;
    }

    public float getProgressPercentage()
    {
        return (level/maxLevel) * 100.0f;
    }

    public int getXP()
    {
        return xp;
    }

    public int getLevel()
    {
        return  level;
    }
}
