#include <iostream>
#include <fstream>
#include "json.hpp"
#include "generator.h"

using namespace std;
using namespace nlohmann;

void Generator::load(string& path)
{
    cout << "Loading map" << endl;
    this->map.load(path);
}

void Generator::generate()
{
    auto map = this->map.get_map();

    this->generate_blocked(map);
}
void Generator::generate_blocked(tiled_map& map)
{
    cout << "Generating blocked tiles" << endl;

    for (auto& layer : map.layers)
    {
        int x = 0;
        int y = 0;

        for (int gid : layer.data)
        {
            auto tileset = this->map.get_tileset(gid);
            auto tile = this->map.get_tile(tileset, gid);

            for (const auto& property : tile.properties)
            {
                if (property.name == "blocked" && property.value == "1")
                {
                    bool duplicate = false;

                    // Check if the x and y position have not been added yet
                    for (int i=0; i<this->blocked_tiles.size(); i+=2)
                    {
                        int& cur_x = this->blocked_tiles[i + 0];
                        int& cur_y = this->blocked_tiles[i + 1];

                        if (cur_x == x && cur_y == y)
                        {
                            duplicate = true;
                            break;
                        }
                    }

                    if (!duplicate)
                    {
                        this->blocked_tiles.push_back(x);
                        this->blocked_tiles.push_back(y);
                    }

                    break;
                }
            }

            x++;

            if (x == map.width)
            {
                x = 0;
                y++;
            }
        }
    }
}

void Generator::save(string& path)
{
    cout << "Saving result json" << endl;

    ofstream file;
    file.open(path);

    if (file.is_open())
    {
        auto map = this->map.get_map();

        json j;
        j["tilewidth"] = map.tilewidth;
        j["tileheight"] = map.tileheight;
        j["width"] = map.width;
        j["height"] = map.height;
        j["blocked"] = this->blocked_tiles;

        file << j.dump(4);
        file.close();
    }
    else
    {
        throw runtime_error("Unable to save json");
    }
}