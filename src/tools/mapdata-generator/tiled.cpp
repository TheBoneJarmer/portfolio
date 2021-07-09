//
// Created by ruben on 12/26/20.
//
#include <iostream>
#include <fstream>
#include "json.hpp"
#include "tiled.h"

namespace tiled
{
    bool tileset_comparer(const tiled_map_tileset& tileset1, const tiled_map_tileset& tileset2)
    {
        return tileset1.firstgid < tileset2.firstgid;
    };

    void from_json(const json& j, tiled_map_tileset& obj)
    {
        j.at("firstgid").get_to(obj.firstgid);
        j.at("source").get_to(obj.source);
    }
    void from_json(const json& j, tiled_map_layer& obj)
    {
        j.at("name").get_to(obj.name);
        j.at("type").get_to(obj.type);
        j.at("width").get_to(obj.width);
        j.at("height").get_to(obj.height);
        j.at("visible").get_to(obj.visible);
        j.at("data").get_to(obj.data);
    }
    void from_json(const json& j, tiled_map& obj)
    {
        j.at("width").get_to(obj.width);
        j.at("height").get_to(obj.height);
        j.at("tilewidth").get_to(obj.tilewidth);
        j.at("tileheight").get_to(obj.tileheight);

        j.at("tilesets").get_to(obj.tilesets);
        j.at("layers").get_to(obj.layers);

        // Sort tilesets
        sort(obj.tilesets.begin(), obj.tilesets.end(), tileset_comparer);

        if (j.contains("properties"))
        {
            j.at("properties").get_to(obj.properties);
        }
    }
    void from_json(const json& j, tiled_property& obj)
    {
        j.at("name").get_to(obj.name);
        j.at("type").get_to(obj.type);

        if (j["type"] == "bool") obj.value = to_string(j["value"].get<bool>());
        if (j["type"] == "number") obj.value = j["value"].get<int>();
    }
    void from_json(const json& j, tiled_tile& obj)
    {
        j.at("id").get_to(obj.id);

        if (j.contains("properties"))
        {
            j.at("properties").get_to(obj.properties);
        }
    }
    void from_json(const json& j, tiled_tileset& obj)
    {
        j.at("name").get_to(obj.name);
        j.at("image").get_to(obj.image);
        j.at("imagewidth").get_to(obj.imagewidth);
        j.at("imageheight").get_to(obj.imageheight);

        j.at("tiles").get_to(obj.tiles);

        if (j.contains("properties"))
        {
            j.at("properties").get_to(obj.properties);
        }
    }

    void TiledMap::load(string &path)
    {
        ifstream file;
        file.open(path);

        if (file.is_open())
        {
            string filedir = path.substr(0,path.find_last_of('/') + 1);
            string filename = path.substr(filedir.size());

            file >> this->source;
            file.close();

            this->parse_map();
            this->parse_tilesets(filedir);
        }
        else
        {
            throw runtime_error("Unable to load json file");
        }
    }
    void TiledMap::parse_map()
    {
        this->map = this->source.get<tiled_map>();
    }
    void TiledMap::parse_tilesets(string &filedir)
    {
        for (const auto& entry : this->map.tilesets)
        {
            ifstream file;
            file.open(filedir + entry.source);

            if (file.is_open())
            {
                json j;
                file >> j;
                file.close();

                tiled_tileset tileset = j.get<tiled_tileset>();
                this->tilesets.push_back(tileset);
            }
            else
            {
                throw runtime_error("Unable to load tileset " + filedir + entry.source);
            }
        }
    }

    int TiledMap::get_gid(tiled_tileset& tileset)
    {
        for (auto& map_tileset : this->map.tilesets)
        {
            if (map_tileset.source == tileset.name + ".json")
            {
                return map_tileset.firstgid;
                break;
            }
        }

        return 0;
    }
    tiled_map TiledMap::get_map()
    {
        return this->map;
    }
    tiled_tileset TiledMap::get_tileset(int &gid)
    {
        tiled_tileset result;

        for (int i=0; i<tilesets.size(); i++)
        {
            if (i < tilesets.size() - 1)
            {
                auto& tileset1 = tilesets[i + 0];
                auto& tileset2 = tilesets[i + 1];
                int gid1 = this->get_gid(tileset1);
                int gid2 = this->get_gid(tileset2);

                if (gid >= gid1 && gid < gid2)
                {
                    result = tileset1;
                    break;
                }

                continue;
            }

            result = tilesets[i];
        }

        return result;
    }
    tiled_tile TiledMap::get_tile(tiled_tileset& tileset, int& gid)
    {
        int firstgid = this->get_gid(tileset);
        int index = gid - firstgid;
        tiled_tile result;

        for (tiled_tile& tile : tileset.tiles)
        {
            if (tile.id == index)
            {
                result = tile;
                break;
            }
        }

        return result;
    }
}