//
// Created by ruben on 12/26/20.
//

#ifndef MAPDATA_GENERATOR_TILED_H
#define MAPDATA_GENERATOR_TILED_H

#include <iostream>
#include "json.hpp"

using namespace std;
using namespace nlohmann;

namespace tiled
{
    struct tiled_property
    {
        string name;
        string type;
        string value;
    };

    struct tiled_tile
    {
        int id;
        vector<tiled_property> properties;
    };

    struct tiled_tileset
    {
        string name;
        string image;
        int imagewidth;
        int imageheight;

        vector<tiled_property> properties;
        vector<tiled_tile> tiles;
    };

    struct tiled_map_tileset
    {
        int firstgid;
        string source;
    };

    struct tiled_map_layer
    {
        string name;
        string type;
        bool visible;
        int width;
        int height;
        vector<int> data;
    };

    struct tiled_map
    {
        int width;
        int height;
        int tilewidth;
        int tileheight;

        vector<tiled_property> properties;
        vector<tiled_map_layer> layers;
        vector<tiled_map_tileset> tilesets;
    };

    class TiledMap
    {
    private:
        json source;
        tiled_map map;
        vector<tiled_tileset> tilesets;

        void parse_map();
        void parse_tilesets(string& filedir);

        int get_gid(tiled_tileset& tileset);

    public:
        void load(string& path);

        tiled_map get_map();
        tiled_tileset get_tileset(int& gid);
        tiled_tile get_tile(tiled_tileset& tileset, int& gid);
    };

    // Overrides
    void from_json(const json& j, tiled_tile& obj);
    void from_json(const json& j, tiled_tileset& obj);
    void from_json(const json& j, tiled_property& obj);
    void from_json(const json& j, tiled_tileset& obj);
    void from_json(const json& j, tiled_map_layer& obj);
    void from_json(const json& j, tiled_map_tileset& obj);
    void from_json(const json& j, tiled_map& obj);
}

#endif //MAPDATA_GENERATOR_TILED_H
