#ifndef MAPDATA_GENERATOR_GENERATOR_H
#define MAPDATA_GENERATOR_GENERATOR_H

#include <iostream>
#include "json.hpp"
#include "tiled.h"

using namespace std;
using namespace nlohmann;
using namespace tiled;

class Generator
{
    private:
        TiledMap map;
        vector<int> blocked_tiles;

        void generate_blocked(tiled_map& map);
    public:
        void load(string& path);
        void generate();
        void save(string& outputFolder);
};

#endif